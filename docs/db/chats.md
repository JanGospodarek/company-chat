# The chats table

The chats table contains the information about the chats of the application. It is used to store the messages and the participants of the chat. It is also used to store the chat's preferences.

## Columns

| Name | Type    | Attributes                             | Default | Description                        |
| ---- | ------- | -------------------------------------- | ------- | ---------------------------------- |
| id   | integer | not null, primary key, autoincrement() |         | The unique identifier of the chat. |
| name | string  | not null                               |         | The name of the chat.              |
| type | string  | not null                               |         | The type of the chat.              |
