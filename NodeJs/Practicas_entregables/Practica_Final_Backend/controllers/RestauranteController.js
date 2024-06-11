const Restaurante = require('../models/Restaurante.model');

// Crear restaurante (POST)
exports.crearRestaurante = async (req, res) => {
    try{
        const { idRestaurante, nombre, direccion, capacidad } = req.body;
        if(!idRestaurante || !nombre || !direccion || !capacidad){
            return res.status(400).json({ message: 'Se necesita que todos los campos esten informados' });
        }

        const newRestaurante = await Restaurante.create({
            idRestaurante,
            nombre,
            direccion,
            capacidad
        });
        res.status(201).json(newRestaurante);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

// Borrar restaurante por id (DELETE)
exports.eliminarRestaurante = async (req, res) => {
    try{
        const { idRestaurante } = req.params;
        const restaurante = await Restaurante.findOneAndDelete(idRestaurante);
        if(!restaurante){
            return res.status(404).json({ message: 'Restaurante no encontrado' });
        }
        return res.status(201).json({ message: 'Restaurante eliminado correctamente' });
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

// Mostrar restaurantes (GET)
exports.getRestaurantes = async (req, res) => {
    try{
        const restaurantes = await Restaurante.find();
        res.status(200).json(restaurantes);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

// Mostrar restaurante por id
exports.getRestauranteById = async (req, res) => {
    try{
        const { idRestaurante } = req.params;
        const restaurante = await Restaurante.findOne({ idRestaurante });
        if(!restaurante){
            res.status(404).json({ message: 'No se ha encontrado el restaurante' });
        }
        return res.status(201).json(restaurante);

    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

