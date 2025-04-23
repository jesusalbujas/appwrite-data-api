# Trigger para Notificar Nuevos Usuarios en Keycloak

``` sql
-- Create the function that sends the notification
CREATE OR REPLACE FUNCTION notify_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Send only the new registration ID as a notification
    PERFORM pg_notify(
        'new_registered_user',
        json_build_object('id', NEW.id)::text
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger for the table user_entity
CREATE TRIGGER new_user_trigger
AFTER INSERT ON user_entity
FOR EACH ROW
EXECUTE FUNCTION notify_new_user();
```

## Ejemplo de Notificación Manual

Puedes probar el canal de notificaciones manualmente con el siguiente comando SQL:

```sql
NOTIFY new_registered_user, '{"id": ??? }';
```

## Notas
- **Canal de notificación**: El canal utilizado es `new_registered_user`.
- **Formato del mensaje**: El mensaje enviado es un objeto JSON con la clave `id` y el valor correspondiente al ID del nuevo usuario.
