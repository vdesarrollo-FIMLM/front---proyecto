#!/bin/bash

# Detener los contenedores y eliminar los servicios definidos en docker-compose.yml
docker compose down

# Commits Locales
git config pull.rebase true
git add .
git commit  -m "Server"

# Actualizar el repositorio git desde la rama "develop"
git pull

# Construir e iniciar los servicios definidos en docker-compose.yml nuevamente
docker compose up --build -d

# Mostrar mensaje de finalización
echo "El script se ha completado correctamente ✅"
