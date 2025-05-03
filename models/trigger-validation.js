export async function triggerValidation (dbKeycloack) {
    try {
        // Verificar si el trigger existe
        const triggerCheckQuery = `
            SELECT COUNT(*) AS trigger_exists
            FROM information_schema.triggers
            WHERE event_object_table = 'user_entity'
            AND trigger_name = 'new_user_trigger';
        `;
        const triggerCheckResult = await dbKeycloack.query(triggerCheckQuery);

        if (parseInt(triggerCheckResult.rows[0].trigger_exists) === 0) {
            console.info("Trigger 'new_user_trigger' Not found. Creating it...");

            // Crear el trigger y la función asociada
            const createTriggerQuery = `
                CREATE OR REPLACE FUNCTION notify_new_user()
                RETURNS TRIGGER AS $$
                BEGIN
                    PERFORM pg_notify(
                        'new_registered_user',
                        json_build_object('id', NEW.id)::text
                    );
                    RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;

                CREATE TRIGGER new_user_trigger
                AFTER INSERT ON user_entity
                FOR EACH ROW
                EXECUTE FUNCTION notify_new_user();
            `;
            await dbKeycloack.query(createTriggerQuery);
            console.info("Trigger 'new_user_trigger' successfully created.");
        } else {
            console.info("Trigger 'new_user_trigger' already exists.");
        }
    } catch (error) {
        console.error("Error: ", error.message);
        throw new Error("Error ejecutando el trigger-validation");
    }
}
