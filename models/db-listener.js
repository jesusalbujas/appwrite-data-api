import dotenv from "dotenv";
import { connectDB } from "./connect-db.js";
import { requestData, sendData } from "./process-data.js";
import { triggerValidation } from "./trigger-validation.js";

dotenv.config();

export async function dbListener(database, channel) {

    try {
        // Clientes de DB
        const dbKeycloack = connectDB (database)
        const dbAdempiere = connectDB ()

        // Conectar a la BD
        await dbKeycloack.connect();
            console.info (`Connected to ${dbKeycloack.database} database`)

        // Verificar si el canal ya existe
        await triggerValidation (dbKeycloack)
    
        // Escuchar notificaciones en el canal "new_registered_user"
        await dbKeycloack.query(`LISTEN ${channel}`);
        
        dbKeycloack.on("notification", async (msg) => {
            if (msg.channel === channel) {
                const payload = JSON.parse(msg.payload);
                const userData = await requestData (payload.id, dbKeycloack)

                // Ennviar los datos a Adempiere
                await sendData (userData, dbAdempiere)

                // Terminar la conexion
                await dbKeycloack.end()
                console.log (`Database ${database} connection closed`)
            }
        });
        // Manejar errores en la conexión
        dbKeycloack.on("error", async (error) => {
            await dbKeycloack.end()
            console.error(error);
        });

        return { message: `db-listener is work`}
    } catch (error) {
        console.error ("ERROR!!! : ", error )
    }
}