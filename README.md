 ATF-M1
Seja bem vindo! A o Módulo de configuração de sistema integrado.


//1. Criar configuração de secret para firebase

// 2. Configure o Firebase Admin
// Você precisa do arquivo JSON da conta de serviço. No Firebase Console:

// Configurações do projeto → Contas de serviço → Gerar nova chave privada

///Converter arquivo
[Convert]::ToBase64String([IO.File]::ReadAllBytes("firebase-service-account.json")) > encoded.txt

[Convert]::ToBase64String([IO.File]::ReadAllBytes("firebase.json")) > encoded.txt