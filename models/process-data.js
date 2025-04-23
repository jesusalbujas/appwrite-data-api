import { connectDB } from "./connect-db.js"


export async function requestData (id, dbKeycloack) {

    // Consulta para obtener los datos del usuario
    const newUser = await dbKeycloack.query(`
        SELECT u.email, u.first_name, u.last_name, u.created_timestamp, c.secret_data 
        FROM user_entity  AS u JOIN credential AS c ON u.id = c.user_id WHERE u.id = $1`, [id])

    // Desestructurar los datos del primer registro
    const { email, first_name: firstName, last_name: lastName, created_timestamp: createdTimestamp, secret_data: secretData  } = newUser.rows[0];

    // Procesar el timestamp
    const time = new Date(Number(createdTimestamp))
    const postgresTimestamp = time.toISOString().replace('T', ' ').replace('Z', '+00');

    // Procesar SecretData
    const secretDataObj = JSON.parse(secretData, dbKeycloack)
    const { value:password, salt: salt } = secretDataObj

    // crear un objeto con los datos
    const userData = {
        ad_user_id: null,
        ad_client_id: 11,
        ad_org_id: 50006,
        ad_role_id: 1000001,
        isactive: "Y",
        created: postgresTimestamp,
        createdby: 100,
        updatedby: 100,
        name: firstName,
        password: password,
        email: email,
        processing: "N",
        value: email,
        isloginuser: "Y",
        isinternaluser: "Y",
        // salt: salt,  
        name2:lastName,
        isdefault: "N",
    }

    return userData
}

export async function sendData (userData, dbAdempiere) {

    // Conectar a la base de datos de adempiere
    await dbAdempiere.connect()
    console.log ("Connected to Adempiere database")

    // Obtener el último ad_user_id
    const resultID = await dbAdempiere.query(`SELECT MAX(ad_user_id) AS last_id FROM AD_USER`);
    const lastId = resultID.rows[0].last_id

    // Generar el nuevo ID
    const newId = Number(lastId) + 10;
    userData.ad_user_id = newId
    
    // Enviar el nuevo usuario a adempiere
    const userQuery = `
        INSERT INTO AD_USER ( ad_user_id, ad_client_id, ad_org_id, isactive, created, createdby, updatedby, name, password, email, value, isloginuser, isinternaluser,name2 ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`;

    const valuesUser = [ userData.ad_user_id, userData.ad_client_id, userData.ad_org_id, userData.isactive, userData.created, userData.createdby, userData.updatedby, userData.name, userData.password, userData.email, userData.value, userData.isloginuser, userData.isinternaluser, userData.name2 ];

    const roleQuery = `
        INSERT INTO ad_user_roles (ad_user_id, ad_role_id, ad_org_id, ad_client_id, isactive, created, createdby, updatedby, isdefault) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;

    const valuesRole = [ userData.ad_user_id, userData.ad_role_id, userData.ad_org_id, userData.ad_client_id, userData.isactive, userData.created, userData.createdby, userData.updatedby, userData.isdefault ];
    
    const resultUser = await dbAdempiere.query(userQuery, valuesUser)
    const resultRole = await dbAdempiere.query(roleQuery, valuesRole)

    if (resultUser.rowCount > 0) console.log(`User ${userData.name} created successfully`)
    if (resultRole.rowCount > 0) console.log(`Role created successfully`)

    // Cerrar la conexión
    await dbAdempiere.end()
    console.log ("Desconnected to Adempiere database")
}

