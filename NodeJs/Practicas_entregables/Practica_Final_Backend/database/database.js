const mongoose = require('mongoose');
require('dotenv').config();

const conectarDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            dbName: process.env.MONGO_DB_NAME
        }).then(() => {
            console.log('La base de datos esta conectada');
        }).catch(err => {
            console.error('No se ha podido conectar la base de datos:', err.message);
        });
    } catch(error) {
        console.error('No se ha podido conectar la base de datos.');
        process.exit(1);
    }
};

module.exports = conectarDb;