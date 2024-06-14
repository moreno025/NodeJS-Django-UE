const User = require('../models/User.model');

// Crear usuarios (POST)
exports.createUser = async (req, res) => {
    try{
        const { idUser, nombre, apellido, correo, telefono } = req.body;
        if(!idUser || !nombre || !apellido || !correo || !telefono){
            return res.status(400).json({ message: 'Se necesita que todos los campos esten informados' });
        }
        
        const newUser = await User.create({
            idUser,
            nombre,
            apellido, 
            correo,
            telefono
        });
        res.status(201).json(newUser);
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Error al crear el usuario.' });
    }
};

// Comprobar todos los usuarios (GET)
exports.getAllUsers = async (req, res) => {
    try{
        const users = await User.find();
        res.status(200).json(users);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

// Comprobar usuario por Id (GET)
exports.getUserById = async (req, res) => {
    try{
        const filtro = { idUser: req.params.id };
        const user = await User.findOne(filtro);
        if(!user){
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(user);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un usuario por su Id (PUT)
exports.updateUser = async (req, res) => {
    try{
        const filtro = { idUser: req.params.id };
        const update = req.body;
        const options = { new: true };

        const user = await User.findOneAndUpdate(filtro, update, options);

        if(!user){
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(user);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

// Eliminar usuario por Id (DELETE)
exports.deleteUser = async (req, res) => {
    try{
        const { idUser } = req.params.id;
        const user = await User.findOneAndDelete(idUser);
        if(!user){
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(204).json({ message: 'Se ha borrado el usuario correctamente' });
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};



