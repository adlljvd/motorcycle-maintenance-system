const { User, Motorcycle, Appointment, Service } = require('../models/index');
const bcrypt = require('bcryptjs');
const formatRupiah = require('../helpers/formatRupiah.js');
const { where } = require('sequelize');


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

    static async getAppointments(req, res) {
        try {
            const appointmentList = await Appointment.findAll({
                where: {
                    
                }
            })
        } catch (error) {
            res.send(error)
            console.log(error)
        }
    }
    static async getAddAppointments(req, res) {
        try {
            res.render('addAppointments')
        } catch (error) {
            res.send(error)
            console.log(error)
        }
    }
    static async postAddAppointments(req, res) {
        try {
            const { id } = req.params
            const { brand, type, year, licensePlate, UserID, serviceName, description, price } = req.body
            await Motorcycle.create({ brand, type, year, licensePlate, UserID: id })
            await Service.create({ serviceName, description, price })

            res.redirect('/appointments')
        } catch (error) {
            res.send(error)
            console.log(error)
        }
    }
    static async getAppointmentsEdit(req, res) {
        try {
            const { id } = req.params
            const { brand, type, year, licensePlate, UserID, serviceName, description, price } = req.body

        } catch (error) {
            res.send(error)
            console.log(error)
        }
    }
    static async postAppointmentsEdit(req, res) {
        try {

        } catch (error) {
            res.send(error)
            console.log(error)
        }
    }
    static async deleteAppointments(req, res) {
        try {

        } catch (error) {
            res.send(error)
            console.log(error)
        }
    }
    static async getResultAppointments(req, res) {
        try {

        } catch (error) {
            res.send(error)
            console.log(error)
        }
    }
}

module.exports = Controller