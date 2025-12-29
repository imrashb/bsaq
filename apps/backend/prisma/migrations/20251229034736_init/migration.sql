-- CreateTable
CREATE TABLE "Product" (
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "volumeMl" INTEGER NOT NULL,
    "abv" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "isAvailableInStore" BOOLEAN NOT NULL,
    "url" TEXT NOT NULL,
    "currentPrice" DOUBLE PRECISION,
    "originalPrice" DOUBLE PRECISION,
    "pureAlcoholMl" DOUBLE PRECISION,
    "pureAlcoholPerDollar" DOUBLE PRECISION,
    "pureAlcoholPerOriginalDollar" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("sku")
);

-- CreateIndex
CREATE INDEX "Product_category_idx" ON "Product"("category");

-- CreateIndex
CREATE INDEX "Product_pureAlcoholPerDollar_idx" ON "Product"("pureAlcoholPerDollar" DESC);
