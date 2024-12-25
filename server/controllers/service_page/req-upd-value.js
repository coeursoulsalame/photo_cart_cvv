const express = require('express');
const db = require('../../db');
const router = express.Router();

router.post('/update-value', async (req, res) => {
    const { fileName, value } = req.body;

    const extractDateFromFileName = (fileName) => {
        const parts = fileName.split('_');
        const dateTimePart = parts[1]?.trim();
        return dateTimePart ? `${dateTimePart}.000` : null;
    };

    try {
        //АЛГОРИТМ
        // 1. Попробуем обновить строку, если она найдена
        const updateQuery = `
            UPDATE su168 
            SET value = $1, valid_ai = false 
            WHERE file_name LIKE $2 || '%'
            RETURNING *
        `;
        const values = [value, fileName];
        const result = await db.query(updateQuery, values);

        if (result.rowCount > 0) {
        // 2. Если строка найдена и обновлена возвращаем её
            return res.json(result.rows[0]);
        }

        // 3. Если строка не найдена извлекаем дату
        const date = extractDateFromFileName(fileName);

        if (!date) {
        // 4. Если дата не извлечена возвращаем ошибку
            return res.status(400).json({ error: 'Invalid fileName format' });
        }

        // 5. Если дата извлечена добавляем новую запись с изменённым именем файла
        const adjustedFileName = `${fileName}.000.jpg`;
        const insertQuery = `
            INSERT INTO su168 (file_name, value, date, valid_ai) 
            VALUES ($1, $2, $3, false)
            RETURNING *
        `;
        const insertValues = [adjustedFileName, value, date];
        const insertResult = await db.query(insertQuery, insertValues);

        // 6. Возвращаем добавленную строку
        return res.status(201).json(insertResult.rows[0]);
    } catch (error) {
        // 7. ошибку и 500
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;