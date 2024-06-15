const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReservaSchema = new Schema({

    fecha: { type: String, required: true },
    hora: { type: String, required: true },
    plazas: { type: Number, required: true },
    estado: { type: String, enum: ['Confirmada', 'Pendiente', 'Cancelada'], default: 'Pendiente', required: true },
    idRestaurante: {type: mongoose.Schema.Types.ObjectId, ref: 'Restaurante', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

});

module.exports = mongoose.model('Reserva', ReservaSchema);