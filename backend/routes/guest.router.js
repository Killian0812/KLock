const router = require('express').Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const guestController = require('../controllers/guest.controller');

router.post('/newEntry', upload.single('File'), guestController.handleNewEntry);

router.post('/requestEntry', upload.single('File'), guestController.handleRequestEntry);

module.exports = router;
