FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

# Instalar nginx
RUN apt update && apt install -y nginx && \
    apt clean && rm -rf /var/lib/apt/lists/*

# Borrar el contenido por defecto de nginx
RUN rm -rf /var/www/html/*

# Copiar archivos compilados a la carpeta pública
COPY build/ /var/www/html/

# (Opcional) Copiar configuración nginx personalizada
COPY nginx.conf /etc/nginx/sites-available/default

# Exponer el puerto
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
