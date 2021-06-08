// Creamos el directorio: 10-CalendarBackend
// Dentro de este directorio ejecutamos el comando (npm init -y)
// Esto nos crea el package.json con los valores por defecto
// Instalamos nodemon en modo adm. (npm i nodemon -g )
// Usamos nodemon para que ejecute el comando "node index.js"
// de manera automatica cuando detecte cambios en el archivo   

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');

// Crear el servidor de express
const app = express();

// CORS
app.use(cors());

// Base de datos
dbConnection();

// Directorio Público (en express usamos "use" para incluir un middleware)
app.use(express.static('public'));

// Lectura y parseo del body
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

// TODO: CRUD: Eventos




// Escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});