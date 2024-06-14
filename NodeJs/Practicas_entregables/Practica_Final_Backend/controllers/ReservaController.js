const mongoose = require('mongoose');
const Reserva = require('../models/Reserva.model');
const User = require('../models/User.model');
const Restaurante = require('../models/Restaurante.model');


// Crear reservas (POST)
exports.crearReserva = async (req, res) => {
    try {
        const { idRestaurante } = req.params;
        const filtro = { idUser: req.params.id };
        const { fecha, hora, plazas, emailUser } = req.body;

        if (!fecha || !hora || !plazas || !emailUser) {
            return res.status(400).json({ message: 'Todos los campos deben estar informados' });
        }

        // Buscar el restaurante por su identificador personalizado
        const restaurante = await Restaurante.findOne({ idRestaurante: idRestaurante });
        if (!restaurante) {
            return res.status(404).json({ message: 'Restaurante no encontrado' });
        }

        // Comprobar disponibilidad
        const CAPACIDAD_MAX = restaurante.capacidad;

        const reservasExistentes = await Reserva.find({ fecha, hora });
        const plazasDisponibles = reservasExistentes.reduce((acc, res) => acc + res.plazas, 0);

        if (plazasDisponibles + plazas > CAPACIDAD_MAX) {
            return res.status(400).json({ message: 'No hay plazas disponibles' });
        }

        // Buscar el usuario por su ID
        const user = await User.findOne(filtro);
        console.log("Buscando usuario con ID:", user.idUser);
        if (!user) {
            return res.status(404).json({ message: 'No se ha encontrado el usuario' });
        }

        console.log("Usuario encontrado:", user);

        // Crear la nueva reserva
        const nuevaReserva = new Reserva({
            fecha,
            hora,
            plazas,
            emailUser,
            user: user._id,
            idRestaurante: restaurante._id
        });

        await nuevaReserva.save();
        res.status(201).json(nuevaReserva);

    } catch (error) {
        console.error("Error al crear la reserva:", error);
        res.status(500).json({ message: error.message });
    }
};

// Mostrar todas las reservas del cliente (GET)
exports.getReservas = async (req, res) => {
    try{
        const { idUser } = req.params;
        const user = await User.findOne({ idUser: idUser });        
        
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
        const objectIdUser = user._id;
        const reservas = await Reserva.find({ user: objectIdUser }).populate('user');
        res.status(200).json(reservas);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

// Mostrar reservas por id segun el estado (GET)
exports.getReservasByStatus = async (req, res) => {
    try{

        const { idUser, estado } = req.params;
        const user = await User.findOne({ idUser: idUser });       
        
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const objectIdUser = user._id;
        const reservas = await Reserva.find({ user: objectIdUser, estado: estado }).populate('user');

        res.status(200).json(reservas);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

// Editar reserva segun el idUser y el id de la reserva (PUT)
exports.updateReservaById = async (req, res) => {
    try{

        const { idUser, id } = req.params;
        const updateData = req.body;
        const reservaUpdate = await Reserva.findOneAndUpdate({ _id: id, user: idUser }, updateData, { new: true });

        if(!reservaUpdate){
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }
        res.status(200).json(reservaUpdate);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

// Confirmar reserva (PUT)
exports.confirmarReserva = async (req, res) => {
    try {
        const { idUser, fecha } = req.params;
        const user = await User.findOne({ idUser: idUser });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const objectIdUser = user._id;
        const reserva = await Reserva.findOne({ fecha: fecha, user: objectIdUser });
        
        if (!reserva) {
            return res.status(404).json({ message: 'Reserva no encontrada o no pertenece al usuario' });
        }
        reserva.estado = 'Confirmada';
        await reserva.save();
        res.status(200).json({ message: 'Reserva confirmada para la fecha ' + fecha + ' a nombre de ' + user.nombre });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cancelar reserva segun el idUser y el id de la reserva (DELETE)
exports.eliminarReserva = async (req, res) => {
    try{
        const { idUser, fecha, hora } = req.params;
        const user = await User.findOne({ idUser: idUser });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const objectIdUser = user._id;
        const reservaEliminada = await Reserva.findOneAndDelete({ fecha: fecha, hora: hora , user: objectIdUser });

        if(!reservaEliminada){
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }
        
        res.status(200).json({ message: 'Reserva eliminada con éxito' });
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};





