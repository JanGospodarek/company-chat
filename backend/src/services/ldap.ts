import { createClient } from "ldapjs";

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

export const loadLDAPUsers = async () => {
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
