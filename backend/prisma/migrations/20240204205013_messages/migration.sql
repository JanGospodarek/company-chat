/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_username_key";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD COLUMN     "user_id" SERIAL NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("user_id");

-- CreateTable
CREATE TABLE "group_chat_members" (
    "member_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "group_chat_id" INTEGER NOT NULL,

    CONSTRAINT "group_chat_members_pkey" PRIMARY KEY ("member_id")
);

-- CreateTable
CREATE TABLE "group_chats" (
    "group_chat_id" SERIAL NOT NULL,
    "group_name" VARCHAR(255) NOT NULL,

    CONSTRAINT "group_chats_pkey" PRIMARY KEY ("group_chat_id")
);

-- CreateTable
CREATE TABLE "messages" (
    "message_id" SERIAL NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "recipient_id" INTEGER,
    "group_chat_id" INTEGER,
    "content" TEXT NOT NULL,
    "timestamp" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("message_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "group_chat_members_user_id_group_chat_id_key" ON "group_chat_members"("user_id", "group_chat_id");

-- AddForeignKey
ALTER TABLE "group_chat_members" ADD CONSTRAINT "group_chat_members_group_chat_id_fkey" FOREIGN KEY ("group_chat_id") REFERENCES "group_chats"("group_chat_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "group_chat_members" ADD CONSTRAINT "group_chat_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_group_chat_id_fkey" FOREIGN KEY ("group_chat_id") REFERENCES "group_chats"("group_chat_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
