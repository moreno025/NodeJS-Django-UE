const express = require('express');
const router = express.Router();
const restauranteController = require('../controllers/RestauranteController');

router.post('/crear-restaurante', restauranteController.crearRestaurante); // hecho
router.delete('/borrar-restaurante/:id', restauranteController.eliminarRestaurante); // hecho
router.get('/restaurantes-list', restauranteController.getRestaurantes); // hecho
router.get('/:idRestaurante', restauranteController.getRestauranteById); // hecho

module.exports = router;