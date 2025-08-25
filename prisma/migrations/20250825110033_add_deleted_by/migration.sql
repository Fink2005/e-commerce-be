/*
  Warnings:

  - The primary key for the `Language` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `code` on the `Language` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Language` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `VarChar(10)`.
  - A unique constraint covering the columns `[name]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,code,type]` on the table `VerificationCode` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `deviceId` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `VerificationCode` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."VerificationCodeType" AS ENUM ('REGISTER', 'FORGOT_PASSWORD', 'LOGIN', 'DISABLE_2FA');

-- DropForeignKey
ALTER TABLE "public"."BrandTranslation" DROP CONSTRAINT "BrandTranslation_languageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CategoryTranslation" DROP CONSTRAINT "CategoryTranslation_languageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductTranslation" DROP CONSTRAINT "ProductTranslation_languageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserTranslation" DROP CONSTRAINT "UserTranslation_languageId_fkey";

-- DropIndex
DROP INDEX "public"."Language_code_key";

-- DropIndex
DROP INDEX "public"."VerificationCode_email_code_type_idx";

-- DropIndex
DROP INDEX "public"."VerificationCode_email_key";

-- AlterTable
ALTER TABLE "public"."Brand" ADD COLUMN     "deletedById" INTEGER;

-- AlterTable
ALTER TABLE "public"."BrandTranslation" ADD COLUMN     "deletedById" INTEGER,
ALTER COLUMN "languageId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."Category" ADD COLUMN     "deletedById" INTEGER;

-- AlterTable
ALTER TABLE "public"."CategoryTranslation" ADD COLUMN     "deletedById" INTEGER,
ALTER COLUMN "languageId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."Language" DROP CONSTRAINT "Language_pkey",
DROP COLUMN "code",
ADD COLUMN     "deletedById" INTEGER,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(10),
ADD CONSTRAINT "Language_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Language_id_seq";

-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "deletedById" INTEGER;

-- AlterTable
ALTER TABLE "public"."Permission" ADD COLUMN     "deletedById" INTEGER;

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "deletedById" INTEGER;

-- AlterTable
ALTER TABLE "public"."ProductTranslation" ADD COLUMN     "deletedById" INTEGER,
ALTER COLUMN "languageId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."RefreshToken" ADD COLUMN     "deviceId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Role" ADD COLUMN     "deletedById" INTEGER;

-- AlterTable
ALTER TABLE "public"."SKU" ADD COLUMN     "deletedById" INTEGER;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "deletedById" INTEGER;

-- AlterTable
ALTER TABLE "public"."UserTranslation" ADD COLUMN     "deletedById" INTEGER,
ALTER COLUMN "languageId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."Variant" ADD COLUMN     "deletedById" INTEGER;

-- AlterTable
ALTER TABLE "public"."VariantOption" ADD COLUMN     "deletedById" INTEGER;

-- AlterTable
ALTER TABLE "public"."VerificationCode" DROP COLUMN "type",
ADD COLUMN     "type" "public"."VerificationCodeType" NOT NULL;

-- DropEnum
DROP TYPE "public"."RegistrationCodeType";

-- CreateTable
CREATE TABLE "public"."Device" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "userAgent" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "lastActive" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Brand_deletedAt_idx" ON "public"."Brand"("deletedAt");

-- CreateIndex
CREATE INDEX "BrandTranslation_deletedAt_idx" ON "public"."BrandTranslation"("deletedAt");

-- CreateIndex
CREATE INDEX "Category_deletedAt_idx" ON "public"."Category"("deletedAt");

-- CreateIndex
CREATE INDEX "CategoryTranslation_deletedAt_idx" ON "public"."CategoryTranslation"("deletedAt");

-- CreateIndex
CREATE INDEX "Language_deletedAt_idx" ON "public"."Language"("deletedAt");

-- CreateIndex
CREATE INDEX "Order_deletedAt_idx" ON "public"."Order"("deletedAt");

-- CreateIndex
CREATE INDEX "Product_deletedAt_idx" ON "public"."Product"("deletedAt");

-- CreateIndex
CREATE INDEX "ProductTranslation_deletedAt_idx" ON "public"."ProductTranslation"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "public"."Role"("name");

-- CreateIndex
CREATE INDEX "Role_deletedAt_idx" ON "public"."Role"("deletedAt");

-- CreateIndex
CREATE INDEX "SKU_deletedAt_idx" ON "public"."SKU"("deletedAt");

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "public"."User"("deletedAt");

-- CreateIndex
CREATE INDEX "UserTranslation_deletedAt_idx" ON "public"."UserTranslation"("deletedAt");

-- CreateIndex
CREATE INDEX "Variant_deletedAt_idx" ON "public"."Variant"("deletedAt");

-- CreateIndex
CREATE INDEX "VariantOption_deletedAt_idx" ON "public"."VariantOption"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationCode_email_code_type_key" ON "public"."VerificationCode"("email", "code", "type");

-- AddForeignKey
ALTER TABLE "public"."Language" ADD CONSTRAINT "Language_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."UserTranslation" ADD CONSTRAINT "UserTranslation_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "public"."Language"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."UserTranslation" ADD CONSTRAINT "UserTranslation_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Device" ADD CONSTRAINT "Device_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."RefreshToken" ADD CONSTRAINT "RefreshToken_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "public"."Device"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Permission" ADD CONSTRAINT "Permission_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Role" ADD CONSTRAINT "Role_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."ProductTranslation" ADD CONSTRAINT "ProductTranslation_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "public"."Language"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."ProductTranslation" ADD CONSTRAINT "ProductTranslation_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."CategoryTranslation" ADD CONSTRAINT "CategoryTranslation_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "public"."Language"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."CategoryTranslation" ADD CONSTRAINT "CategoryTranslation_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Variant" ADD CONSTRAINT "Variant_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."VariantOption" ADD CONSTRAINT "VariantOption_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."SKU" ADD CONSTRAINT "SKU_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Brand" ADD CONSTRAINT "Brand_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."BrandTranslation" ADD CONSTRAINT "BrandTranslation_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "public"."Language"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."BrandTranslation" ADD CONSTRAINT "BrandTranslation_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
