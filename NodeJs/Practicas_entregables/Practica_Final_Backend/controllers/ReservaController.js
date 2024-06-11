const Reserva = require('../models/Reserva.model');
const User = require('../models/User.model');
const Restaurante = require('../models/Restaurante.model');


// Crear reservas (POST)
exports.crearReserva = async (req, res) => {
    try{
        const { idUser, idRestaurante } = req.params;
        const { fecha, hora, plazas, emailUser } = req.body;

        if(!fecha || !hora || !plazas || !emailUser){
            return res.status(404).json({ message: 'Todos los campos deben estar informados' });
        }
        const restaurante = await Restaurante.findOne({ idRestaurante: idRestaurante });
        if (!restaurante) {
            return res.status(404).json({ message: 'Restaurante no encontrado' });
        }
        console.log("El idrestaurante vale: " + restaurante.idRestaurante);
        console.log("La capacidad vale: " + restaurante.capacidad);

        // Comprobar disponibilidad
        const CAPACIDAD_MAX = restaurante.capacidad;

        const reservasExistentes = await Reserva.find({ fecha, hora });
        const plazasDisponibles = reservasExistentes.reduce((acc, res) => acc + res.plazas, 0);

        if (plazasDisponibles + plazas > CAPACIDAD_MAX){
            return res.status(400).json({ message: 'No hay plazas disponibles' });
        }

        const user = await User.findOne(idUser);
        if(!user){
            return res.status(404).json({ message: 'No se ha encontrado el usuario' });
        }

        const nuevaReserva = new Reserva ({
            fecha,
            hora,
            plazas,
            emailUser,
            user: user._id,
            restaurante: restaurante.idRestaurante
        });

        await nuevaReserva.save();
        res.status(201).json(nuevaReserva);

    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

// Mostrar todas las reservas del cliente (GET)
exports.getReservas = async (req, res) => {
    try{
        const { idUser } = req.params;
        const reservas = await Reserva.find({ user: idUser }).populate('user');
        res.status(200).json(reservas);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

// Mostrar reservas por id segun el estado (GET)
exports.getReservasByStatus = async (req, res) => {
    try{
        const { idUser, estado } = req.params;
        const reservas = await Reserva.find({ user: idUser, estado }).populate('user');
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

// Cancelar reserva segun el idUser y el id de la reserva (PUT)
exports.eliminarReserva = async (req, res) => {
    try{
        const { idUser, id } = req.params;
        const reservaEliminada = await Reserva.findOneAndDelete({ _id: id, user: idUser });

        if(!reservaEliminada){
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }
        res.status(200).json({ message: 'Reserva eliminada con éxito' });
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};





