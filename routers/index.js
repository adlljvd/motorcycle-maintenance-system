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

// router.use('/admin', (req, res, next) => {
//     if (req.session.user.role !== 'admin') {
//         const error = 'You do not have access!';
//         return res.redirect('/login?error=' + error);
//     }
//     next();
// });

router.get('/admin/customers', Controller.showCustomerDetails)
router.get('/admin/appointments/:id/status', Controller.getEditStatusById)
router.post('/admin/appointments/:id/services/:serviceId/status', Controller.postEditStatusById);
// router.get('/admin/appointments/filter', Controller.filterAppointmentsByStatus);


// router.use((req, res, next) => {
//     if (req.session.userId && req.session.role !== 'customer') {
//         const error = 'You are an admin, can`t access to customer features!';
//         return res.redirect(`/login?error=${error}`);
//     }
//     next();
// });

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
router.get('/appointments/result', Controller.getAppointmentResult); // View the result of an appointment





module.exports = router;

