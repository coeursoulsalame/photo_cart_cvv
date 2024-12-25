const photoData = require('./service_page/req-photo-data');
const photoInfo = require('./service_page/req-info-photo');
const updateValue = require('./service_page/req-upd-value'); 
const deletePhoto = require('./service_page/req-delete-photo');
const archivePhoto = require('./service_page/req-archive-photo');
const filterPhoto = require('./service_page/req-filter-photo');
const infoFromdb = require('./service_page/req-info-from-db');

module.exports = function configureRoutes(app) {
    app.use('/api/photos', photoData);
    app.use('/api/photos', photoInfo);
    app.use('/api/photos', updateValue); 
    app.use('/api/photos', deletePhoto); 
    app.use('/api/photos', archivePhoto);
    app.use('/api/photos', filterPhoto);
    app.use('/api/database', infoFromdb);
}