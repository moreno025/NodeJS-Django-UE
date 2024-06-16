// Imports necesarios
const express = require('express');
const bodyParser = require('body-parser');
const conectarDb = require('./database/database.js');
const startCronJob = require('./cronJob');
require('dotenv').config();

// Routes de las APIs
const userRoutes = require('./routes/User.routes.js');
const reservaRoutes = require('./routes/Reserva.routes.js');
const restauranteRoutes = require('./routes/Restaurante.routes.js');

// Variables
const app = express();
const port = process.env.port || 3000;

//Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
conectarDb();
startCronJob(); 

// Rutas de los controllers
app.use('/users', userRoutes);
app.use('/reservas', reservaRoutes);
app.use('/restaurantes', restauranteRoutes);

// Conexion server
app.listen(port, () => {
    console.log(`Server escuchando en el puerto ${port}`);
});

