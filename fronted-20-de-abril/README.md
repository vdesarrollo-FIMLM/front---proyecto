[![Node.js CI](https://github.com/fimlm/Ultimate/actions/workflows/node.js.yml/badge.svg)](https://github.com/fimlm/Ultimate/actions/workflows/node.js.yml)

# App • Midgar Frontend • ReactJs 🍧

Duplique el archivo .env.example por un .env

- No borré el .env.example

### Genere el JWT del Login por Next

Genere el Secret Key y Token y agreguelos al .env

### Instalar dependencias npm
Para instalar las dependencias de NodeJS, debe instalar primero NodeJs en su maquina. Puedes encontrar más información sobre Node.Js en la [página oficial](https://nodejs.org/).

De ser nceecesario, puede limpiar la cache de npm
$ npm cache clean --force

1. Luego para iniciar el proyecto utilice
$ npm install
2. Despues de instalar todas las dependencias en local arranque el proyecto:

### Entorno de producción
$ npm run build 

⚠ For production Image Optimization with Next.js, the optional 'sharp' package is strongly recommended. Run 'npm i sharp', and Next.js will use it automatically for Image Optimization.
Read more: https://nextjs.org/docs/messages/sharp-missing-in-production 
# $ npm i sharp 

### Entorno de desarrollo
$ npm run dev
3. Start 🚀
### Iniciamos el App
$ npm start

### 🚀 Excellente, todo esta bien.
Si todo funciona correctamente deberias poder abrir el App en el puerto correspondiente en localhost URL: http://localhost:3000


# Dockerizar
Docker Produccion
$ docker compose up --build -d
Docker ambiente de desarooll

$ PENDIENTE
