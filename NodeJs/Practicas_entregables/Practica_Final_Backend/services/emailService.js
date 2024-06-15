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
        console.log('Error with email transporter: ', error);
    }else{
        console.log('Server is ready to take our messages');
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

module.exports = { enviarCorreoConfirmacion };