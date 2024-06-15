const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/ReservaController');

router.post('/:id/reserva-restaurante/:idRestaurante', reservaController.crearReserva);
router.get('/reservas-list/:idUser', reservaController.getReservas);
router.get('/:idUser/reserva-status/:estado', reservaController.getReservasByStatus);
router.get('/disponibilidad/:idRestaurante/:fecha/:hora', reservaController.getDisponibilidad);
router.put('/:idUser/reserva-update/:id', reservaController.updateReservaById);
router.put('/confirmar-reserva/:idUser/:fecha', reservaController.confirmarReserva);
router.delete('/cancelar-reserva/:idUser/:fecha/:hora', reservaController.eliminarReserva);

module.exports = router;