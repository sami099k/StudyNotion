const express = require('express');
const { capturePayment, verifySignature } = require('../controllers/Payments');
const { auth, isStudent } = require('../middlewares/auth');
const router = express.Router();

router.post('/capturePayment',auth,isStudent,capturePayment);

router.post('/verifySignature',auth,isStudent,verifySignature);


module.exports = router;