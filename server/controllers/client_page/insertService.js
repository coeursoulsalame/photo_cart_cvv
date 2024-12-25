const express = require('express');
const router = express.Router();
const db = require('../../db'); 

router.post('/insert', async (req, res) => {
	const { number, start_date, end_date, option } = req.body;

	try {
		const result = await db.query(
			'INSERT INTO service_log (number, start_date, end_date, option) VALUES ($1, $2, $3, $4) RETURNING id',
			[number, start_date, end_date, option]
		);

		const serviceId = result.rows[0].id; 
		res.status(201).json({
			message: 'Запись успешно добавлена',
			id: serviceId,
			number,
			start_date,
			end_date,
			option
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
});

module.exports = router;