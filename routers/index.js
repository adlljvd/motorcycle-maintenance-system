const express = require('express');
const router = express.Router()
const Controller = require('../controllers/controller');


router.get('/register', Controller.getRegisterForm)
router.post('/register', Controller.postRegisterForm)
router.get('/login', Controller.getLoginForm)
router.post('/login', Controller.postLoginForm)

router.get('/')

module.exports = router