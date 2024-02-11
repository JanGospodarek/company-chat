# The messages table

The messages table contains the information about the messages of the application. It is used to store the content of the messages and the participants of the chat.

## Columns

| Name       | Type     | Attributes                             | Default | Description                                     |
| ---------- | -------- | -------------------------------------- | ------- | ----------------------------------------------- |
| id         | integer  | not null, primary key, autoincrement() |         | The unique identifier of the message.           |
| chat_id    | integer  | not null, foreign key (chats.id)       |         | The unique identifier of the chat.              |
| user_id    | integer  | not null, foreign key (users.id)       |         | The unique identifier of the user.              |
| content    | string   | not null                               |         | The content of the message.                     |
| attachment | string   |                                        |         | The attachment of the message.                  |
| created_at | datetime | not null                               | now()   | The date and time when the message was created. |

## Indexes

| Name                  | Columns  | Type   | Description                              |
| --------------------- | -------- | ------ | ---------------------------------------- |
| messages_chat_id_index | chat_id |        | The index of the chat's identifier.      |
| messages_user_id_index | user_id |        | The index of the user's identifier.      |

## Foreign Keys

| Name                  | Column   | Reference | Description                              |
| --------------------- | -------- | --------- | ---------------------------------------- |
| messages_chat_id_fkey | chat_id  | chats.id  | The chat of the message.                 |
| messages_user_id_fkey | user_id  | users.id  | The user of the message.                 |

