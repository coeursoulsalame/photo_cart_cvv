const db = require('../../../config/db');

class StatisticsController {
    constructor() {
        this.db = db;
    }

    async getTableData(req, res) {
        try {
            const limit = req.query.limit || 200;
            const tableId = parseInt(req.query.tableId, 10);

            // Сопоставление tableId с именами таблиц
            const tableMapping = {
                1: 'su168',
                2: 'service_log',
            };

            const tableName = tableMapping[tableId];

            if (!tableName) {
                return res.status(400).json({ error: "Unsupported tableId" });
            }

            const result = await this.db.query(
                `SELECT * FROM ${tableName} ORDER BY id DESC LIMIT $1`,
                [limit]
            );

            if (result.rowCount > 0) {
                let rows = result.rows;

                if (tableId === 1) {
                    rows = rows.map((row) => {
                        if (row.detection !== null && row.detection !== undefined) {
                            try {
                                if (Array.isArray(row.detection)) {
                                } else if (typeof row.detection === "string") {
                                    if (row.detection.startsWith('[') && row.detection.endsWith(']')) {
                                        row.detection = JSON.parse(row.detection);
                                    } else {
                                        console.error("Detection column does not contain valid JSON:", row.detection);
                                    }
                                } else if (typeof row.detection === "number") {
                                    row.detection = [row.detection];
                                } else if (typeof row.detection === "object") {
                                    //  оставляем как есть
                                } else {
                                    console.error("Unexpected detection data type:", typeof row.detection);
                                }
                            } catch (error) {
                                console.error("Error parsing JSON:", error.message);
                            }
                        } else {
                            row.detection = null;
                        }

                        if (typeof row.valid_ai === "boolean") {
                            row.valid_ai = row.valid_ai.toString();
                        }

                        return row;
                    });
                }

                return res.json({
                    data: rows,
                });
            } else {
                return res.status(404).json({ error: "No data found in the table" });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async insertServiceRecord(req, res) {
        const { number, start_date, end_date, option } = req.body;

        try {
            const result = await this.db.query(
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
    }
}

module.exports = StatisticsController;