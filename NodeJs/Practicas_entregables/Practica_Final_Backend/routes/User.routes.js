const express = require('express');
const router = express.Router();
const usercontroller = require('../controllers/UserController');

// Rutas API para le gestion de usuarios
router.post('/', usercontroller.createUser);
router.get('/', usercontroller.getAllUsers);
router.get('/:id', usercontroller.getUserById);
router.put('/:id', usercontroller.updateUser);
router.delete('/:id', usercontroller.deleteUser);

module.exports = router;
