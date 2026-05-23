const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Разбор JSON-тела запросов
app.use(express.json());

// Раздача статических файлов из папки public
app.use(express.static(path.join(__dirname, 'public')));

// Маршрут для приёма заявок
app.post('/api/request', (req, res) => {
    const { name, email, message } = req.body;

    // Простейшая проверка
    if (!name || !email) {
        return res.status(400).json({ error: 'Имя и email обязательны' });
    }

    const newRequest = {
        id: Date.now(),
        name,
        email,
        message: message || '',
        createdAt: new Date().toISOString()
    };

    // Читаем существующие заявки (если файла нет — создаём пустой массив)
    let requests = [];
    try {
        if (fs.existsSync('data.json')) {
            const raw = fs.readFileSync('data.json');
            requests = JSON.parse(raw);
        }
    } catch (err) {
        console.error('Ошибка чтения файла заявок:', err);
    }

    requests.push(newRequest);

    // Сохраняем обратно в файл
    fs.writeFileSync('data.json', JSON.stringify(requests, null, 2), 'utf8');

    console.log('Новая заявка:', newRequest);
    res.json({ success: true });
});

// Все остальные GET-запросы — отдаём index.html (для SPA-режима, но здесь не обязательно)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});