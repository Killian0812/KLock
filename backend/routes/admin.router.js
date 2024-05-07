const router = require('express').Router();
const adminController = require('../controllers/admin.controller');
const verifyRole = require('../middlewares/verifyRole');

router.get('/allRoom', verifyRole("ADMIN"), adminController.handleGetRooms);

router.post('/newRoom', verifyRole("ADMIN"), adminController.handleNewRoom);

router.route('/room/:id', verifyRole("ADMIN"))
    .get(adminController.handleGetRoom)
    .post(adminController.handleEditRoom)
    .delete(adminController.handleDeleteRoom);

// router.get('/findUsers', adminController.handleFindUsers);

router.get('/allUsers', verifyRole("ADMIN"), adminController.handleGetAllUsers);

router.put('/blockOrUnblock/:userId', verifyRole("ADMIN"), adminController.handleBlockOrUnblockUser)

router.get('/dashboardInfo', adminController.handleGetDashboardInfo);

module.exports = router;
