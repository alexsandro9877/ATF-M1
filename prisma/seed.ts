import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {

  const codBase = await prisma.settingBase.upsert({
    where: { cod_base: 1},
    update: {},
    create: {
        desc_grupo:"Configuração",
        desc_subgrupo:"Base",
        description:"Configuração de tipos de armazenagem",
        name:"PUTAWAY_TYPE",
        state:"",
        settings:{
            create:{
                description: "Locais de picking",
                name:"PICKING",
                id:1,
            }
        }


    },
  })
  console.log(codBase)
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })