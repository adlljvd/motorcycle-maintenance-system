const express = require('express');
const app = express()
const session = require('express-session');
const port = 3001 //process.env.PORT || 3000;
const routers = require('./routers/index');

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        sameSite: true //untuk security dari csrf attack
    } //https
}))

app.use(routers);

app.listen(port, () => {
    console.log(`Surfing on port `, port)
})