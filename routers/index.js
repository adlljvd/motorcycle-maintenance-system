const express = require('express');
const router = express.Router()
const Controller = require('../controllers/controller');


router.get('/', Controller.showLandingPage) // show all our services
router.get('/register', Controller.getRegisterForm) // ini user ketika click navbar appointment
router.post('/register', Controller.postRegisterForm)

router.get('/appointments', Controller.getAppointments) //appointments list
router.get('/appointments/add', Controller.getAddAppointments) // page form untuk user isi data diri dan motor
router.post('/appointments/add', Controller.postAddAppointments)
router.get('/appointments/:id/edit', Controller.getAppointmentsEdit) // form untuk mengedit sesuai id yang di click

router.get('/login', Controller.getLoginForm)
router.post('/login', Controller.postLoginForm)


module.exports = router