# Usa a imagem oficial do Node.js
FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos necessários
COPY package*.json ./
COPY index.js ./

# Instala as dependências
RUN npm install

# Expõe a porta que sua aplicação vai usar
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["node", "index.js"]
