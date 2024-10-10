const { User, Motorcycle, Appointment, Service } = require('../models/index');
const bcrypt = require('bcryptjs');
const formatRupiah = require('../helpers/formatRupiah.js');



class Controller {

    static async showLandingPage(req, res) {
        try {

            const serviceList = await Service.findAll()
            console.log(serviceList)
            res.render('index.ejs', { serviceList, formatRupiah })
            

        } catch (error) {
            res.send(error)
            console.log(error)
        }
    }

    static async getRegisterForm(req, res) {
        try {
            // res.send('registerForm')
            res.render('register-form.ejs')
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async postRegisterForm(req, res) {
        try {
            const { name, email, password, phone, address } = req.body
            await User.create({
                name,
                email,
                password,
                phone,
                address,
                role: 'customer'
            })

            res.redirect('/login')
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async getLoginForm(req, res) {
        try {
            const { error } = req.query
            res.render('login-form.ejs', { error })
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async postLoginForm(req, res) {
        try {
            const { email, password } = req.body
            const user = await User.findOne({
                where: {
                    email
                }
            })

            if (user) {
                const isValidPassword = bcrypt.compareSync(password, user.password)
                if (isValidPassword) {

                    //case berhasil
                    req.session.userId = user.id //set session di controller login

                    return res.redirect('/')
                } else {
                    const error = `invalid username/password`
                    return res.redirect(`/login?error=${error}`)
                }
            } else {
                const error = `invalid username/password`
                return res.redirect(`/login?error=${error}`)
            }

        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async getMotorcycle(req, res) {
        try {
            const userId = req.session.userId;  // Assuming you're using session and user is logged in
            const motorcycles = await Motorcycle.findAll({ where: { UserId: userId } });
            
            if (motorcycles.length > 0) {
                res.render('motorcycle-details', { motorcycles, hasMotorcycle: true });
            } else {
                res.render('motorcycle-details', { motorcycles: null, hasMotorcycle: false });
            }
        } catch (error) {
            res.send(error)
            console.log(error)
        }
    }

    static async getAddMotorcycle(req, res) {
        try {
            res.render('add-motorcycle');  
        } catch (error) {
            res.send(error)
            console.log(error)
        }
    }

    static async postAddMotorcycle(req, res) {
        try {
            const { brand, type, year, licensePlate } = req.body;
        const userId = req.session.userId;

        // Add the motorcycle to the database
        await Motorcycle.create({ brand, type, year, licensePlate, UserId: userId });

        // Redirect to the appointments page to display updated list of motorcycles
        res.redirect('/appointments'); 
        } catch (error) {
            res.send(error)
            console.log(error)
        }
    }

    static async getAppointments(req, res) {
        try {
            const userId = req.session.userId;
    
            const appointments = await Appointment.findAll({
                where: { MotorcycleId: userId },  
                include: [Motorcycle, Service]
            });
    
            const motorcycle = await Motorcycle.findOne({
                where: { UserId: userId }
            });
    
            const services = await Service.findAll();
            
    
            res.render('appointments', {
                appointments,
                motorcycle,
                services,
                hasMotorcycle: !!motorcycle,
                formatRupiah
            });
        } catch (error) {
            res.send(error);
            console.log(error);
        }
    }
    
    
    static async getAddAppointment(req, res) {
        try {
            const userId = req.session.userId;

            // Fetch the user's motorcycle
            const motorcycle = await Motorcycle.findOne({
                where: { UserId: userId }
            });

            // Fetch all services to display in the form
            const services = await Service.findAll();

            res.render('add-appointment', {
                motorcycle,
                services,
                formatRupiah
            });        
        } catch (error) {
            res.send(error)
            console.log(error)
        }
    }

    static async postAddAppointment(req, res) {
        try {
            const { appointmentDate, serviceId } = req.body;
            const userId = req.session.userId;

            // Fetch the motorcycle associated with the user
            const motorcycle = await Motorcycle.findOne({ where: { UserId: userId } });

            if (!motorcycle) {
                // If no motorcycle exists, redirect to add motorcycle
                return res.redirect('/appointments');
            }

            // Create the appointment with the motorcycle and service
            await Appointment.create({
                appointmentDate,
                MotorcycleId: motorcycle.id,
                ServiceId: serviceId,
                status: 'Scheduled',
                totalPrice: await Service.findOne({ where: { id: serviceId } }).then(service => service.price)
            });

            // After adding the appointment, redirect to appointments page
            res.redirect('/appointments');
        } catch (error) {
            res.send(error)
            console.log(error)
        }
    }

    static async getEditAppointment(req, res) {
        try {
            console.log(req.params, "<<<<<<<REQ PARAMSSS"); // Should log { id: someId }
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).send('No ID provided');
            }
    
            const appointment = await Appointment.findOne({
                where: { id },
                include: [Motorcycle, Service]
            });
    
            if (!appointment) {
                return res.status(404).send('Appointment not found');
            }
    
            const services = await Service.findAll();
    
            res.render('edit-appointment.ejs', { appointment, services, formatRupiah, id });
        } catch (error) {
            res.send(error);
            console.log(error);
        }
    }
    
    
    static async postEditAppointment(req, res) {
        try {
            const { id } = req.params;
            const { appointmentDate, serviceId, status, totalPrice } = req.body;
    
            // Update the appointment in the database
            await Appointment.update(
                {
                    appointmentDate,
                    ServiceId: serviceId,
                    status,
                    totalPrice
                },
                { where: { id } }
            );
    
            // Redirect back to the appointments page after successful update
            res.redirect('/appointments');
        } catch (error) {
            res.send(error);
            console.log(error);
        }
    }
    
    
    
    static async deleteAppointment(req, res) {
        try {
            const { id } = req.params;
    
            // Find and delete the appointment
            const appointment = await Appointment.findOne({
                where: { id }
            });
            await appointment.destroy();
    
            res.redirect('/appointments');
        } catch (error) {
            res.send(error);
            console.log(error);
        }
    }
    

    static async getAppointmentResult(req, res) {
        try {
            
        } catch (error) {
            res.send(error)
            console.log(error)
        }
    }
}

module.exports = Controller