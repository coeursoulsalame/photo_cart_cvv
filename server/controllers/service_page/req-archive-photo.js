const express = require('express');
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

router.get('/screenshot', (req, res) => {
    const { timestamp } = req.query;
    const url = `http://10.9.1.153:11880/screenshot?dt=${timestamp}`; 

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
});

module.exports = router;