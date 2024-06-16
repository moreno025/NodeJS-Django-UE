const cron = require('node-cron');
const Reserva = require('../models/Reserva.model');
const User = require('../models/User.model');
const { sendReservaAvisoEmail } = require('./emailService');

const enviarAvisoReserva = async () => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 1);
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const fechaStr = `${anio}-${mes}-${dia}`;

    try{
        const reservas = await Reserva.find({ fecha: fechaStr }).populate('user');

        for(const reserva of reservas){
            const user = await User.findOne(reserva.user);

            if(reserva.estado !== 'Confirmada'){
                await sendReservaAvisoEmail(user, reserva, 'Por favor, confirme su reserva.');
            }else{
                await sendReservaAvisoEmail(user, reserva, 'Recordatorio de su reserva.');
            }
        }
    }catch(error){
        console.error('Error al enviar recordatorios de reserva:', error);
    }
};

const startCronJob = () => {
    cron.schedule('0 1 * * *', sendDailyReminders);
    console.log('Cron job iniciado: recordatorios de reservas serán enviados');
};

module.exports = startCronJob;

