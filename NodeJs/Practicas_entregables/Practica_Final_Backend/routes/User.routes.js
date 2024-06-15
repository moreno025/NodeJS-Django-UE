const express = require('express');
const router = express.Router();
const usercontroller = require('../controllers/UserController');

// Rutas API para le gestion de usuarios
router.post('/', usercontroller.createUser); // hecho
router.get('/', usercontroller.getAllUsers); // hecho
router.get('/:id', usercontroller.getUserById); // hecho
router.put('/:id', usercontroller.updateUser); // hecho
router.delete('/:id', usercontroller.deleteUser); // hecho

module.exports = router;
