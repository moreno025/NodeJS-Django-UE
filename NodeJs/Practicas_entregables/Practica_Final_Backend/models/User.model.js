const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Esquema del usuario
const UserSchema = new Schema({

    idUser: { type: Number, unique: true, required: true },
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    telefono: { type: String, required: true },

});

// Se crea/exporta el modelo de Reserva
module.exports = mongoose.model('User', UserSchema);