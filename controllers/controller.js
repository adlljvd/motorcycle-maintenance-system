const {User, Motorcycle, Appointment, Service} = require('../models/index');

class Controller {
    static async showLandingPage(req, res) {
        try {
            
        } catch (error) {

        }
    }
    static getRegisterForm(req, res) {
        try{
            // res.send('registerForm')
            res.render('register-form.ejs')
        }catch(error){
            console.log(error)
            res.send(error)
        }
    }

    static postRegisterForm(req, res) {
        try{
            res.send('postRegisterfORM')
        }catch(error){
            console.log(error)
            res.send(error)
        }
    }
}

module.exports = Controller