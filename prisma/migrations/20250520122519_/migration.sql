-- AlterTable
CREATE SEQUENCE settings_id_seq;
ALTER TABLE "settings" ALTER COLUMN "id" SET DEFAULT nextval('settings_id_seq');
ALTER SEQUENCE settings_id_seq OWNED BY "settings"."id";

-- CreateTable
CREATE TABLE "finalizadora" (
    "id" SERIAL NOT NULL,
    "cod_int_sap_sim" TEXT NOT NULL,
    "cod_rede" TEXT,
    "desc_rede" TEXT,
    "cod_bandeira" TEXT,
    "desc_bandeira" TEXT,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_ultima_modificacao" TIMESTAMP(3) NOT NULL,
    "user_id_mod" TEXT NOT NULL,
    "desc_finalizadora" TEXT NOT NULL,
    "cod_finalizadora" INTEGER NOT NULL,
    "tipo_crtl" TEXT NOT NULL,
    "ind_status" BOOLEAN NOT NULL,

    CONSTRAINT "finalizadora_pkey" PRIMARY KEY ("id")
);
