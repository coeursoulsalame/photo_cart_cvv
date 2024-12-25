const express = require('express');
const db = require('../../db');
const router = express.Router();

router.get('/photo-info', async (req, res) => {
	const { name } = req.query;

	try {
		const trimmedFileName = name.split('.')[0]; 

		const query = `
			SELECT pred, value, confidence_score, valid_ai
			FROM su168 
			WHERE file_name LIKE $1 || '%'
		`;
		const values = [trimmedFileName];
		const result = await db.query(query, values);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: 'Photo not found' });
		}

		res.json(result.rows[0]);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

module.exports = router;