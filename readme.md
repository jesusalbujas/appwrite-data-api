# DB Listener

**DB Listener** es una herramienta para escuchar notificaciones de Keycloak al crear nuevos procesar datos en tiempo real, integrándose con Adempiere.

## Requisitos

- **Node.js**: v16 o superior.
- **PostgreSQL**: v12 o superior.
- Archivo `.env` configurado:

```ADEMPIERE_DB_NAME="adempiere"
ADEMPIERE_DB_USER="adempiere"
ADEMPIERE_DB_PASSWORD="adempiere"
POSTGRES_PORT="5432"
KEYCLOAK_DB_DATABASE="keycloak"
DB_HOST="api.adempiere.io"
API_PORT=1238
```

## Configuración del Trigger

Es necesario colocar el trigger en la base de datos de Keycloak para que las notificaciones funcionen correctamente.

## Instalación de Dependencias

1. Instala las dependencias necesarias:
   ```bash
   npm install
   ```

2. Inicia el listener:
   ```bash
   npm start