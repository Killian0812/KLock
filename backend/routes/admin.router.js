const router = require('express').Router();
const adminController = require('../controllers/admin.controller');
const verifyRole = require('../middlewares/verifyRole');

router.get('/allRoom', verifyRole("ADMIN"), adminController.handleGetRooms);

router.post('/newRoom', verifyRole("ADMIN"), adminController.handleNewRoom);

router.delete('/room/:id', verifyRole("ADMIN"), adminController.handleDeleteRoom);

module.exports = router;
