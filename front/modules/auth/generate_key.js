const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

export function regen() {
    const envFilePath = path.join("../../", '.env');
    // Генерирует 32-байтовый ключ
    const secretKey = crypto.randomBytes(32).toString('hex');
    fs.appendFile(envFilePath, `SECRET_KEY=${secretKey}\n`, (err) => {
        if (err) {
            console.error('Ошибка при записи в .env файл:', err);
        } else {
            console.log('SECRET_KEY успешно записан в .env файл:', secretKey);
        }
    });
}