const { User, Motorcycle, Appointment, Service } = require('../models/index');
const bcrypt = require('bcryptjs');


class Controller {

    static async showLandingPage(req, res) {
        try {

        } catch (error) {

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
                    return res.send('SUKSES MASUK')
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
}

module.exports = Controller