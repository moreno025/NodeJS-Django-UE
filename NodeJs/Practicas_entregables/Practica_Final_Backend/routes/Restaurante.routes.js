const express = require('express');
const router = express.Router();
const restauranteController = require('../controllers/RestauranteController');

router.post('/crear-restaurante', restauranteController.crearRestaurante);
router.delete('/borrar-restaurante/:id', restauranteController.eliminarRestaurante);
router.get('/restaurantes-list', restauranteController.getRestaurantes);
router.get('/:idRestaurante', restauranteController.getRestauranteById);

module.exports = router;