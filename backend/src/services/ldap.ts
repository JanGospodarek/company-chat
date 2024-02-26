import { createClient } from "ldapjs";
import { CronJob } from "cron";
import prisma from "@config/db";

const ldapUrl = "ldap://host.docker.internal:389";
const ldapBindDn = "cn=admin,dc=example,dc=org";
const ldapBindCredentials = "admin";
const ldapSearchBase = "ou=pracownicy,dc=example,dc=org";

type User = {
  name: string;
  surname: string;
  username: string;
};

const client = createClient({
  url: ldapUrl,
});

const getAttribute = (entry: any, attribute: string) => {
  return entry.attributes.find((a: any) => a.type === attribute)?.values[0];
};

const loadLDAPUsers = async () => {
  return new Promise<User[]>((resolve, reject) => {
    client.bind(ldapBindDn, ldapBindCredentials, (err) => {
      if (err) {
        reject(err);
      }

      // LDAP search options
      const ldapSearchOptions = {
        scope: "sub", // Search the whole subtree
        // Find only user accounts
        filter: "objectClass=posixAccount",
      };

      // Searching for the group
      // @ts-ignore
      client.search(ldapSearchBase, ldapSearchOptions, (err, res) => {
        if (err) {
          reject(err);
          return;
        }

        const users: { pojo: string }[] = [];

        res.on("searchEntry", (entry: any) => {
          users.push(entry);
        });

        res.on("end", (result: any) => {
          const parsedUsers = users.map((user) => {
            const jsonedUser = JSON.parse(JSON.stringify(user.pojo));

            return {
              name: getAttribute(jsonedUser, "givenName"),
              surname: getAttribute(jsonedUser, "sn"),
              username: getAttribute(jsonedUser, "uid"),
            };
          });

          client.unbind((err) => {});

          resolve(parsedUsers);
        });
      });
    });
  });
};

export const loginUser = async (username: string, password: string) => {
  client.bind(`uid=${username},${ldapBindDn}`, password, (err, res) => {
    if (err) {
      client.unbind();
      throw new Error("Zły login lub hasło");
    }

    client.unbind();
  });
};

export async function setupLDAP() {
  // Create a new cron job that runs every 15 minutes
  const job = new CronJob("0 */15 * * * *", () => {
    console.log("Syncing users");
    syncUsers();
    console.log("Next job", job.nextDate());
  });

  job.start();

  console.log("Next job", job.nextDate());
}

async function syncUsers() {
  const users = await loadLDAPUsers();

  for (const user of users) {
    await updateDB(user);
  }
}

async function updateDB(user: User) {
  const dbUser = await prisma.user.findUnique({
    where: {
      username: user.username,
    },
  });

  if (!dbUser) {
    await prisma.user.create({
      data: {
        username: user.username,
        name: user.name,
        surname: user.surname,
      },
    });
  }
}
