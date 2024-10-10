const express = require('express');
const router = express.Router();
const Controller = require('../controllers/controller');

// Public routes
router.get('/register', Controller.getRegisterForm);
router.post('/register', Controller.postRegisterForm);
router.get('/login', Controller.getLoginForm);
router.post('/login', Controller.postLoginForm);
router.get('/', Controller.showLandingPage); // Home page that shows available services
router.get('/logout', Controller.logout);


// Authentication middleware
router.use((req, res, next) => {
    if (!req.session.userId) {
        const error = 'Please login first!';
        return res.redirect(`/login?error=${error}`);
    }
    next();
});

// Private routes for authenticated users
router.get('/motorcycle', Controller.getMotorcycle);
router.get('/motorcycle/add', Controller.getAddMotorcycle);
router.post('/motorcycle/add', Controller.postAddMotorcycle);

// Appointments-related routes
router.get('/appointments', Controller.getAppointments); // View all appointments
router.get('/appointments/add', Controller.getAddAppointment); // Form to create a new appointment
router.post('/appointments/add', Controller.postAddAppointment); // Post request to add a new appointment
router.get('/appointments/:id/edit', Controller.getEditAppointment);
router.post('/appointments/:id/edit', Controller.postEditAppointment); // Post request to update appointment
router.get('/appointments/:id/delete', Controller.deleteAppointment); // Delete/cancel an appointment
router.get('/appointments/:id/result', Controller.getAppointmentResult); // View the result of an appointment

module.exports = router;

