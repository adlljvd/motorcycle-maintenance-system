// Middleware to check if the user is logged in
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next(); // Continue to the next middleware or route handler
    } else {
        const error = 'Please login first!';
        res.redirect(`/login?error=${error}`); // Redirect to login if not authenticated
    }
}

// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
        return next(); // Continue if the user is an admin
    } else {
        const error = 'You do not have admin access!';
        res.redirect(`/login?error=${error}`); // Redirect if the user is not an admin
    }
}

// Middleware to check if the user is a customer
function isCustomer(req, res, next) {
    if (req.session.user && req.session.user.role === 'customer') {
        return next(); // Continue if the user is a customer
    } else {
        const error = 'You do not have access!';
        res.redirect(`/login?error=${error}`); // Redirect if the user is not a customer
    }
}

module.exports = { isAuthenticated, isAdmin, isCustomer };
