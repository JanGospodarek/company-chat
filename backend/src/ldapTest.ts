import { createClient } from "ldapjs";

const ldapUrl = "ldap://host.docker.internal:389";
const ldapBindDn = "cn=admin,dc=example,dc=org";
const ldapBindLogin = "ou=pracownicy,dc=example,dc=org";
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

export const loginUser = async (username: string, password: string) => {
  client.bind(`cn=${username},${ldapBindLogin}`, password, (err, res) => {
    if (err) {
      console.error(err);
      client.unbind();
      return;
    }

    console.log(res.pojo);
    client.unbind();
  });
};

await loginUser("Andrzej Kowalski", "asdf");
