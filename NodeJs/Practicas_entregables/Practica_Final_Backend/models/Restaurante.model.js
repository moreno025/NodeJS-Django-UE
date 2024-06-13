const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RestauranteSchema = new Schema({

    idRestaurante: { type: String, required: true, unique: true },
    nombre: { type: String, required: true, unique: true },
    direccion: { type: String, required: true, unique: true },
    capacidad: { type: Number, required: true }

});

module.exports = mongoose.model('Restaurante', RestauranteSchema);

