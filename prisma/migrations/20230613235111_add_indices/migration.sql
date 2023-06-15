-- CreateTable
CREATE TABLE "Walk" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "space" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "walk" INTEGER NOT NULL,
    "start" REAL NOT NULL,
    "end" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Attribute" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "walkId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Attribute_walkId_fkey" FOREIGN KEY ("walkId") REFERENCES "Walk" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Step" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "attributeId" INTEGER NOT NULL,
    "intensity" REAL NOT NULL,
    "score" REAL NOT NULL,
    CONSTRAINT "Step_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Walk_space_direction_idx" ON "Walk"("space", "direction");

-- CreateIndex
CREATE INDEX "Attribute_name_idx" ON "Attribute"("name");

-- CreateIndex
CREATE INDEX "Step_intensity_idx" ON "Step"("intensity");
