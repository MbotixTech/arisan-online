-- CreateTable
CREATE TABLE "members" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "arisan_periods" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "durationMonths" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "payments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "memberId" INTEGER NOT NULL,
    "arisanId" INTEGER NOT NULL,
    "amount" DECIMAL NOT NULL,
    "paymentDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'paid',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "payments_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "payments_arisanId_fkey" FOREIGN KEY ("arisanId") REFERENCES "arisan_periods" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "winners" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "arisanId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "drawDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "winners_arisanId_fkey" FOREIGN KEY ("arisanId") REFERENCES "arisan_periods" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "winners_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "winners_arisanId_memberId_key" ON "winners"("arisanId", "memberId");
