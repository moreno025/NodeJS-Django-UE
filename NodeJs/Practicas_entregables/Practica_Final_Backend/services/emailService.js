require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify((error, sucess) => {
    if(error){
        console.log('Error con el emailTransporter: ', error);
    }else{
        console.log('Servidor de nodemailer listo para enviar correos');
    }
});

const enviarCorreoConfirmacion = async (reserva, user) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.correo,
        subject: 'Confirmación de reserva',
        text: `${user.nombre}, \n\nTu reserva para el día ${reserva.fecha} a las ${reserva.hora} ha sido confirmada.\n\n Hasta pronto!`
    };

    try{
        await transporter.sendMail(mailOptions);
        console.log('Correo de confirmación enviado');
    }catch(error){
        console.error('Error al enviar correo de confirmación:', error);
    }
};

// Función para enviar un correo de actualización de reserva
const sendReservaActualizacionEmail = async (user, reserva) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.correo,
        subject: 'Actualización de tu reserva',
        text: `Hola ${user.nombre},

        Tu reserva ha sido actualizada con los siguientes detalles:
        - Fecha: ${reserva.fecha}
        - Hora: ${reserva.hora}
        - Plazas: ${reserva.plazas}
        - Estado: ${reserva.estado}

        Saludos,
        Equipo de Reservas`
    };

    try{
        await transporter.sendMail(mailOptions);
        console.log('Correo de actualización enviado');
    }catch(error){
        console.error('Error al enviar correo de actualización:', error);
    }
};

// Función para enviar un correo de aviso de reserva
const sendReservaAvisoEmail = async (user, reserva, mensajePersonalizado) => {
    const mailOptions = {
        from: 'tuEmail@gmail.com',
        to: user.correo,
        subject: 'Aviso de Reserva',
        text: `Hola ${user.nombre},
        \n\n${mensajePersonalizado}\n\nDetalles de la reserva:
        \nFecha: ${reserva.fecha}
        \nHora: ${reserva.hora}
        \nPlazas: ${reserva.plazas}
        \n\nGracias,
        \nTu Equipo de Reservas`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Correo enviado a ${user.correo}`);
    } catch (error) {
        console.error('Error al enviar correo:', error);
    }
};

module.exports = { enviarCorreoConfirmacion, sendReservaActualizacionEmail, sendReservaAvisoEmail };