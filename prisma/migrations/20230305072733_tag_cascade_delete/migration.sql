-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,
    CONSTRAINT "Tag_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Tag" ("id", "name", "noteId") SELECT "id", "name", "noteId" FROM "Tag";
DROP TABLE "Tag";
ALTER TABLE "new_Tag" RENAME TO "Tag";
CREATE UNIQUE INDEX "Tag_id_key" ON "Tag"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
