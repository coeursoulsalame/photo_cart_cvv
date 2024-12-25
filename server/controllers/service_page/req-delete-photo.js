const express = require('express');
const db = require('../../db');
const router = express.Router();
const { minioClient } = require('../../minio/minio');

const deleteFileFromMinio = (bucketName, fileName) => {
	return new Promise((resolve, reject) => {
		minioClient.removeObject(bucketName, fileName, (err) => {
		if (err) {
			return reject(err);
		}
		resolve();
		});
	});
};

router.post("/delete-photo", async (req, res) => {
	const { name } = req.body; 

	try {
		const bucketName = 'su168-screenshot';

		await deleteFileFromMinio(bucketName, name);

		const deleteQuery = `
			DELETE FROM su168 
			WHERE file_name = $1
			RETURNING *
		`;
		const values = [name];
		const result = await db.query(deleteQuery, values);

		if (result.rowCount > 0) {
			return res.json({ message: 'File and row db deleted', deletedFile: result.rows[0] });
		} else {
			return res.status(404).json({ error: 'Row not found in db' });
		}

	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Internal Server Error' });
	}
});

module.exports = router;