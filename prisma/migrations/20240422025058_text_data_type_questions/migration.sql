-- DropIndex
DROP INDEX `Questions_title_key` ON `questions`;

-- AlterTable
ALTER TABLE `questions` MODIFY `title` TEXT NULL;
