# Usamos una imagen oficial de Node.js
FROM node:20-slim

# Instalamos dependencias necesarias para Expo
RUN apt-get update && apt-get install -y \
    git \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Definimos el directorio de trabajo
WORKDIR /app

# Copiamos los archivos de dependencias primero para optimizar el cache
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos los puertos que usa Expo (8081 para el metro bundler)
EXPOSE 8081

# Comando por defecto para iniciar expo
CMD ["npx", "expo", "start", "--lan"]
