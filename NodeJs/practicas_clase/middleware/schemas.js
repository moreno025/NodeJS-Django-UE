const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express();

require('./database');

app.use(express.json());

//Esquema para representar los datos en la bbdd
const tareasSchema = new mongoose.Schema({
    titulo: {type: String, required: true},
    descripcion: String,
    status: {type: String, required: true, default: 'to-do'},
});

const Tarea = mongoose.model('Tarea', tareasSchema);
