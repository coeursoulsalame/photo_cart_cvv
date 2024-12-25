const express = require("express");
const db = require("../../db");
const router = express.Router();

router.get("/get-table", async (req, res) => {
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

        const result = await db.query(
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
});

module.exports = router;