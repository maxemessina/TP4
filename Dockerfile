# Usamos una versión liviana de Node
FROM node:18-alpine

# crea carpeta de trabajo dentro del contenedor
WORKDIR /app

COPY package*.json ./

RUN npm install

# copia todo el resto
COPY . .

# puerto de la API
EXPOSE 3000

CMD ["npm", "run", "dev"]