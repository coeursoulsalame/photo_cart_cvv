const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '..', '..', '.env') });

class ArchiveController {
    constructor() {
        // Пока пустой
    }

    async getPhotoFromArchive(req, res) {
        const { timestamp } = req.query;
        const url = `${process.env.NODERED_URL}/screenshot?dt=${timestamp}`; 

        try {
            fetch(url).then(() => {
                console.log('Yes, photo find in arch');
            }).catch(error => {
                console.error(error);
            });

            res.status(200).json({ message: 'Not answer' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = ArchiveController;