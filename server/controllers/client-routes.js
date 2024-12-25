const insertService = require('./client_page/insertService')

module.exports = function configureRoutes(app) {
    app.use('/api/service', insertService);
}