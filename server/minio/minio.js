const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const Minio = require('minio');

const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_END_POINT,
    port: Number(process.env.MINIO_PORT),
    useSSL: false, 
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY
});

module.exports = { minioClient};