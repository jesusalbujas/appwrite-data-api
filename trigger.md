CREATE OR REPLACE FUNCTION notify_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Enviar solo el ID del nuevo registro como notificación
    PERFORM pg_notify(
        'new_registered_user',
        json_build_object('id', NEW.id)::text
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear el trigger para la tabla user_entity
CREATE TRIGGER new_user_trigger
AFTER INSERT ON user_entity
FOR EACH ROW
EXECUTE FUNCTION notify_new_user();

-- example to NOTIFY
NOTIFY new_registered_user, '{"id" : "NEW.id"}'
