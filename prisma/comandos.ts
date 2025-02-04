
// -- Comandos iniciais 
//     docker compose up -d
//     npx prisma init
// ----Criar o modelo de tabelas
// ----Criar as conexao com banco
// ----Comando para criar tabela no banco
//     npx prisma migrate dev --name init
// npx prisma generate
// ---Apos criar ver as tabelas no banco, executar o sofware DBeaver que ja instalei.
// ---Entao conexao com o banco que criou Postgres

// "dev": "npx tsx watch src/server.ts",
// "vercel-build": "prisma generate && prisma migrate dev && prisma db seed"


//npm install @vercel/node --save-dev
// --- criar o seed
// incluir no package.json
// "prisma": {
//     "seed": "tsx prisma/seed.ts"
//   },
//   se precisard  "build": "tsc -b && vite build",
// --- npx prisma db seed
// npx prisma studio
