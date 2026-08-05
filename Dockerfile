# Etapa 1: build
FROM node:20-alpine AS build

WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm install

# Copia o restante do projeto
COPY . .

# Build da aplicação
RUN npm run build

# Etapa 2: servidor
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Configuração inline do Nginx para corrigir o 404 nas rotas do React (SPA)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expor a porta padrão do Nginx que o Easypanel vai mapear
EXPOSE 80


CMD ["nginx", "-g", "daemon off;"] 