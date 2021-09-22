# Loops Bot

Bot para o discord, com finalidade de tocar músicas em um canal de voz em loop, 24 horas por dia.

## Comandos

- **[!loop]** - Inicia o loop de músicas no novo servidor.
- **[!stop]** - Parar o bot no servidor.

## To-do

- [x] Criar o comando **[!loop]** para começar o loop de músicas no servidor.
- [x] Criar o comando **[!stop]** para parar o loop de músicas no servidor.
- [ ] Fazer fetch das músicas armazenadas no banco de dados.
- [ ] Salvar quantidade de servidores que o bot está em loop na API externa.
- [ ] Adicionar tipagem fixa dos comandos possiveis

## Regras

- [x] Após o comando **[!loop]**, o bot irá enviar uma mensagem de boas vindas e irá ficar em loop até que seja enviado o comando **[!stop]**.
- [x] Após o loop ser iniciado o bot só pode reagir ao comando **[!stop]**.
- [x] Após o comando **[!stop]**, o bot irá enviar uma mensagem de despedida e irá sair do canal de voz, só podendo ser re-iniciado pelo comando **[!loop]**.
- [x] Após o comando **[!stop]**, o bot só pode reagir ao comando **[!loop]**.
