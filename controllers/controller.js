const { User, Motorcycle, Appointment, Service } = require('../models/index');
const bcrypt = require('bcryptjs');
const formatRupiah = require('../helpers/formatRupiah.js');
const { Op } = require('sequelize');

const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

class Controller {

    static async showLandingPage(req, res) {
        try {
            const serviceList = await Service.findAll()
            console.log(serviceList)
            res.render('index.ejs', { serviceList, formatRupiah})
            

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
                    req.session.role = user.role //set session di controller login

                    if(req.session.role === 'customer'){
                        return res.redirect('/appointments')
                    }
                    if(req.session.role === 'admin'){
                        return res.redirect('/admin/customers')
                    }

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
                attributes: ['id', 'appointmentDate', 'MotorcycleId', 'status', 'ServiceId', 'totalPrice'],
                include: [Motorcycle, Service],
                where: { MotorcycleId: userId } 
            });
            
            const motorcycle = await Motorcycle.findOne({
                where: { UserId: userId }
            });
    
            const services = await Service.findAll();
            
            // res.send(appointments)
    
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
            const userId = req.session.userId; // Mengambil userId dari sesi
            const appointments = await Appointment.findAll({
                where: {
                    MotorcycleId: userId,
                    status: 'Completed'
                },
                include: [Motorcycle, Service]
            });

            if (appointments.length === 0) {
                return res.status(404).send('Tidak ada janji yang telah selesai ditemukan');
            }

            const pdfDir = path.join(__dirname, '..', 'public', 'pdfs');
            if (!fs.existsSync(pdfDir)) {
                fs.mkdirSync(pdfDir, { recursive: true });
            }

            const doc = new PDFDocument();
            let fileName = `Hasil_Janji_${userId}.pdf`;
            let filePath = path.join(pdfDir, fileName);

            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            res.setHeader('Content-Type', 'application/pdf');

            doc.pipe(fs.createWriteStream(filePath));
            doc.pipe(res);
            doc.fontSize(20).text('The Result of Our Inspection and Services about Your MotorCycles', { align: 'center' });
            doc.moveDown();

            appointments.forEach((appointment, index) => {
                doc.fontSize(16).text(`Appointment ${index + 1}`, { underline: true });
                doc.fontSize(12).text(`Appointment Date: ${appointment.appointmentDate}`);
                doc.text(`Motorcycle Brand: ${appointment.Motorcycle.brand}`);
                doc.text(`Motorcycle Type: ${appointment.Motorcycle.type}`);
                doc.text(`Service Name: ${appointment.Service.serviceName}`);
                doc.text(`Technician Assigned: ${appointment.technicianName}`);  // jika ada data teknisi
                doc.text(`Service Description: ${appointment.Service.description || 'No description available'}`);
                doc.text(`Total Service Time: 4 hours`);
                doc.text(`Total Cost: ${formatRupiah(appointment.totalPrice)}`);
                doc.text(`Payment Status: ${appointment.paymentStatus || 'Pending'}`);
                doc.text(`Service Status: ${appointment.status}`);
                doc.text(`Customer Feedback: ${appointment.feedback || 'No feedback provided'}`);
                doc.text(`Service Notes: ${appointment.notes || 'No additional notes'}`);
                doc.text(`Warranty Expiry: ${appointment.warrantyExpiry || 'No warranty provided'}`);
                doc.text(`Service Rating: ${appointment.rating ? appointment.rating + ' stars' : 'Not rated'}`);

                doc.moveDown();
            });
            doc.end();

        } catch (error) {
            res.status(500).send(error);
            console.log(error);
        }
    }
    
    static logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                return res.send('Error logging out');
            }
            res.redirect('/login'); // Redirect to the login page after logout
        });
    }

    //      ADMIN 

    static async showCustomerDetails(req, res) {
        try {
            const customers = await User.findAll({
                where:{
                    role:'customer'
                },
                include:[Motorcycle]
            });

            const motorcycles = await Motorcycle.findAll({
                include:[Appointment, Service]
            })

            res.render('admin-customer-details.ejs', { customers, motorcycles });
            // res.send(customers)
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    static async getEditStatusById(req, res) {
        try {
            const { id } = req.params;
        

            // Retrieve the customer by their appointment or motorcycle (depending on your system)
            const customer = await User.findOne({
                include: {
                    model: Motorcycle,
                    where: { id }
                }
            });
    
            // Retrieve all the appointments related to the customer's motorcycle
            const appointments = await Appointment.findAll({
                where: { MotorcycleId: id },
                include: [Service]
            });
    
            if (!customer) {
                return res.status(404).send('Customer not found');
            }
    
            res.render('admin-edit-status.ejs', { appointments, customer });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
    

    static async postEditStatusById(req, res) {
        try {
            const { id } = req.params;  // Get appointment id from route parameter
            const { status } = req.body;  // Get the new status from the request body

            // Find the appointment by id
            const appointment = await Appointment.findOne({ where: { id } });

            if (!appointment) {
                return res.status(404).send('Appointment not found.');
            }

            // Update the status
            appointment.status = status;
            await appointment.save();  // Save the updated status

            res.redirect(`/admin/appointments/${id}/status`);  // Redirect back to the customer details page
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    // static async filterAppointmentsByStatus(req, res) {
    //     try {
    //         const { status } = req.query;

    //         // Create filter condition based on status, use Sequelize Op method
    //         let whereCondition = {};
    //         if (status && status !== 'All') {
    //             whereCondition = {
    //                 status: {
    //                     [Op.eq]: status // Use Sequelize Op.eq for exact match
    //                 }
    //             };
    //         }

    //         // Fetch appointments based on the filter condition
    //         const appointments = await Appointment.findAll({
    //             where: whereCondition,
    //             include: [
    //                 {
    //                     model: Motorcycle,
    //                     include: [User]
    //                 },
    //                 {
    //                     model: Service
    //                 }
    //             ]
    //         });

    //         // Pass filtered data and the current status to the view
    //         res.render('admin-edit-status.ejs', { appointments, status });
    //     } catch (error) {
    //         res.status(500).send(error.message);
    //     }
    // }
    
}

module.exports = Controller