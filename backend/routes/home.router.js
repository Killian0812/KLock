const router = require('express').Router();
const verifyRole = require('../middlewares/verifyRole');
const homeController = require('../controllers/home.controller');

router.get('/getUserInfo/:username', verifyRole("USER", "ADMIN"), homeController.handleGetUserInfo)

router.post('/updateExpoPushToken/:username', verifyRole("USER", "ADMIN"), homeController.handleUpdateExpoPushToken)

router.get('/findRooms', verifyRole("USER"), homeController.handleFindRooms);

router.get('/rooms', verifyRole("USER"), homeController.handleGetRooms);

router.get('/roomDetails', homeController.handleGetRoomDetails);

router.get('/roomEntries', verifyRole("USER"), homeController.handleGetRoomEntries)

router.post('/roomUnregister', homeController.handleRoomUnregister);

router.post('/roomRegister', homeController.handleRoomRegister);

router.get('/pendingRequests', verifyRole("USER"), homeController.handleGetPendingRequests)

router.post('/approveEntry', verifyRole("USER"), homeController.handleApproveEntry);

router.post('/updateUserInfo', verifyRole("USER"), homeController.handleUpdateUserInfo);

router.post('/changePassword', verifyRole("USER"), homeController.handleChangePassword);

module.exports = router;
