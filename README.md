# ФОТОЧКИ

Веб-приложение для отслеживания и анализа оборота автоклавных вагонеток с фотографиями, аналитикой и оповещениями в реальном времени.

## Технологический стек

### Frontend
- React 
- Ant Design 
- React Context (управление WS)
- DayJS для работы с датами
- Axios для HTTP-запросов

### Зависимости клиента
```json
{
  "dependencies": {
    "@ant-design/icons": "^5.5.2",
    "@date-io/dayjs": "^3.0.0",
    "antd": "^5.23.1",
    "axios": "^1.7.5",
    "dayjs": "^1.11.13",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-query": "^3.39.3",
    "react-router-dom": "^6.26.1"
  }
}
```

### Backend
- Node.js + Express 4
- WebSocket (ws)
- PostgreSQL (pg 8)
- MinIO 8 для хранения файлов
- Sharp для обработки изображений
- JWT (jsonwebtoken) для аутентификации
- bcryptjs для хеширования

### Зависимости сервера
```json
{
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2",
    "minio": "^8.0.1",
    "node-fetch": "^3.3.2",
    "pg": "^8.12.0",
    "sharp": "^0.33.5",
    "ws": "^8.18.0"
  }
}
```

### Основные функции

#### Сервисная часть
- Просмотр фотографий вагонеток в реальном времени
- Фильтрация фотографий по дате и времени
- Просмотр нераспознанных значений
- Загрузка фотографий из архива

#### Клиентская часть
- Обслуживание вагонеток
- База данных с историей операций

#### Безопасность
- JWT аутентификация
- Хеширование паролей
- Защищенные API-endpoints
- Контроль доступа к ресурсам

### Предварительные требования
- Docker и Docker Compose
- Node.js 21.x или выше для локальной разработки
- PostgreSQL если запуск без Docker
- MinIO если запуск без Docker

### Для запуска проекта необходимо создать .env файл в корневой папке проекта (обязательные константы WDS_SOCKET_PORT, WDS_SOCKET_PATH, REACT_PORT и .т.д) не изменяются в режиме разработки:
```env
WDS_SOCKET_PORT=0
WDS_SOCKET_PATH=/ws
REACT_PORT=3000
EXPRESS_PORT=3001
REACT_APP_WS_SOCKET_PORT=3001
MINIO_END_POINT=
MINIO_PORT=
MINIO_ACCESS_KEY=
MINIO_SECRET_KEY=
MINIO_BUCKET_NAME=
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
NODERED_URL=
```