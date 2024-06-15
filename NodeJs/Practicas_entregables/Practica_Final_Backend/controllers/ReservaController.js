const { enviarCorreoConfirmacion } = require('../services/emailService');
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

        const restaurante = await Restaurante.findOne({ idRestaurante: idRestaurante });
        if (!restaurante) {
            return res.status(404).json({ message: 'Restaurante no encontrado' });
        }

        const CAPACIDAD_MAX = restaurante.capacidad;
        const reservasExistentes = await Reserva.find({ fecha, hora });
        const plazasDisponibles = reservasExistentes.reduce((acc, res) => acc + res.plazas, 0);

        if (plazasDisponibles + plazas > CAPACIDAD_MAX) {
            return res.status(400).json({ message: 'No hay plazas disponibles' });
        }

        const user = await User.findOne(filtro);
        if (!user) {
            return res.status(404).json({ message: 'No se ha encontrado el usuario' });
        }

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


// Mostrar la disponibilidad de un restaurante según fecha y hora (GET)
exports.getDisponibilidad = async (req, res) => {
    try {
        const { idRestaurante, fecha, hora } = req.params;
        const restaurante = await Restaurante.findOne({ idRestaurante: idRestaurante });

        if (!restaurante) {
            return res.status(404).json({ message: 'Restaurante no encontrado' });
        }

        const CAPACIDAD_MAX = restaurante.capacidad;
        const reservasExistentes = await Reserva.find({ idRestaurante: restaurante._id, fecha, hora });
        const plazasOcupadas = reservasExistentes.reduce((acc, res) => acc + res.plazas, 0);
        const plazasDisponibles = CAPACIDAD_MAX - plazasOcupadas;

        res.status(200).json({ 
            message: `Existen ${plazasDisponibles} plazas disponibles en el restaurante ${restaurante.nombre} para la fecha ${fecha} a las ${hora}.`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Editar reserva segun el idUser y el id de la reserva (PUT)
exports.updateReservaById = async (req, res) => {
    try {
        const { idUser, id } = req.params;
        const updateData = req.body;

        const user = await User.findOne({ idUser: idUser });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const objectIdUser = user._id;
        const reservaActual = await Reserva.findOne({ _id: id, user: objectIdUser }).populate('user');

        if (!reservaActual) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }

        if (updateData.plazas) {
            const restaurante = await Restaurante.findById(reservaActual.idRestaurante);

            if (!restaurante) {
                return res.status(404).json({ message: 'Restaurante no encontrado' });
            }

            const CAPACIDAD_MAX = restaurante.capacidad;
            const reservasExistentes = await Reserva.find({ fecha: updateData.fecha, hora: updateData.hora });
            const plazasDisponibles = reservasExistentes.reduce((acc, res) => acc + (res._id.equals(reservaActual._id) ? 0 : res.plazas), 0);

            if (plazasDisponibles + updateData.plazas > CAPACIDAD_MAX) {
                return res.status(400).json({ message: 'No hay plazas disponibles' });
            }
        }

        const reservaUpdate = await Reserva.findOneAndUpdate({ _id: id, user: objectIdUser }, updateData, { new: true });

        if (!reservaUpdate) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }
        res.status(200).json({ message: "Se ha actualizado la reserva. Nombre: " + user.nombre + " Fecha: " + 
            reservaActual.fecha + " Hora: " + reservaActual.hora + " Plazas: " + reservaActual.plazas });
    } catch (error) {
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

        await enviarCorreoConfirmacion(reserva, user);
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





