const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
        return next()
    }
    req.flash('errorMsg', 'Inicie sesion');
    res.redirect('/admin');
}

module.exports = helpers;