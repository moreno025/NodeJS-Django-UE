const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/ReservaController');

router.post('/:id/reserva-restaurante/:idRestaurante', reservaController.crearReserva);
router.get('/reservas/:idUser', reservaController.getReservas);
router.get('/:idUser/reserva-status/:estado', reservaController.getReservasByStatus);
router.put('/:idUser/reserva-update/:id', reservaController.updateReservaById);
router.delete('/:idUser/cancelar-reserva/:id', reservaController.eliminarReserva);

module.exports = router;