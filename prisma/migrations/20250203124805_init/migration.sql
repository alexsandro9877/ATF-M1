-- CreateTable
CREATE TABLE "setting_base" (
    "cod_base" SERIAL NOT NULL,
    "desc_grupo" TEXT NOT NULL,
    "desc_subgrupo" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "state" TEXT DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "setting_base_pkey" PRIMARY KEY ("cod_base")
);

-- CreateTable
CREATE TABLE "settings" (
    "cod_base" INTEGER NOT NULL,
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_cod_base_fkey" FOREIGN KEY ("cod_base") REFERENCES "setting_base"("cod_base") ON DELETE RESTRICT ON UPDATE CASCADE;
