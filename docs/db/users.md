# The users table

The users table contains the information about the users of the application. It is used for authentication and authorization. It is also used to store the user's preferences.

## Columns

| Name       | Type     | Attributes            | Default         | Description                                       |
| ---------- | -------- | --------------------- | --------------- | ------------------------------------------------- |
| id         | integer  | not null, primary key | autoincrement() | The unique identifier of the user.                |
| username   | string   | not null, unique      |                 | The username of the user.                         |
| password   | string   | not null              |                 | The password of the user. (hashed)                |
| created_at | datetime | not null              | now()           | The date and time when the user was created.      |
| updated_at | datetime | not null              | now()           | The date and time when the user was last updated. |

## Indexes

| Name                  | Columns  | Type   | Description                              |
| --------------------- | -------- | ------ | ---------------------------------------- |
| users_username_unique | username | unique | The username of the user must be unique. |

## Foreign Keys

## Queries

### Get all users

```sql
SELECT id, username, updated_at FROM users;
```

### Get a user by id

```sql
SELECT id, username, updated_at FROM users WHERE id = ?;
```

### Get a user by username

```sql
SELECT id, username, updated_at FROM users WHERE username = ?;
```

### Create a user

```sql
INSERT INTO users (username, password) VALUES (?, ?);
```
