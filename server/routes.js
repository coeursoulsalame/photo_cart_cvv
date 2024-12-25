const serviceRoures = require('./controllers/service-routes')
const clientRoutes = require('./controllers/client-routes')

module.exports = function configureRoutes(app) {
    serviceRoures(app);
    clientRoutes(app);
}