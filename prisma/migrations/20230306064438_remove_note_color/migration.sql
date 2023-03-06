/*
  Warnings:

  - You are about to drop the column `color` on the `Note` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Note" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);
INSERT INTO "new_Note" ("content", "createdAt", "id", "slug", "title", "updatedAt") SELECT "content", "createdAt", "id", "slug", "title", "updatedAt" FROM "Note";
DROP TABLE "Note";
ALTER TABLE "new_Note" RENAME TO "Note";
CREATE UNIQUE INDEX "Note_id_key" ON "Note"("id");
CREATE UNIQUE INDEX "Note_slug_key" ON "Note"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
