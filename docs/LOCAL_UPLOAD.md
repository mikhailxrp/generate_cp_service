# Локальное хранение изображений

## Обзор

Система использует локальное хранение файлов вместо внешних сервисов (Cloudinary). Все изображения сохраняются в папке `/public/uploads/` и обрабатываются через библиотеку Sharp.

## Структура папок

```
/public/
  /uploads/
    /avatars/      # Аватары менеджеров (400x400px JPEG)
    /logos/        # Логотипы клиентов (800x400px PNG)
    /.gitkeep      # Для сохранения структуры в git
```

**Важно:** Сами файлы не попадают в git (см. `.gitignore`), только структура папок.

## Типы изображений

### Аватары менеджеров

- **Размер:** 400x400px
- **Формат:** JPEG
- **Качество:** 85%
- **Обрезка:** Квадратная, с фокусом на центр
- **Путь:** `/uploads/avatars/avatar_{userId}_{timestamp}_{random}.jpg`
- **API:** `/api/upload-avatar`
- **Компонент:** `AvatarUpload.jsx`

### Логотипы клиентов

- **Размер:** 800x400px (макс)
- **Формат:** PNG (с прозрачностью)
- **Качество:** 90%
- **Обрезка:** Сохранение пропорций с padding
- **Путь:** `/uploads/logos/logo_{timestamp}_{random}.png`
- **API:** `/api/upload-logo`
- **Компонент:** `LogoUpload.jsx`

## Обработка изображений

Используется библиотека **Sharp** для:

- Изменения размера (resize)
- Оптимизации качества
- Конвертации форматов
- Обрезки и трансформации

### Пример обработки (аватар):

```javascript
await sharp(buffer)
  .resize(400, 400, {
    fit: "cover",
    position: "center",
  })
  .jpeg({ quality: 85 })
  .toBuffer();
```

### Пример обработки (логотип):

```javascript
await sharp(buffer)
  .resize(800, 400, {
    fit: "inside",
    background: { r: 255, g: 255, b: 255, alpha: 0 },
  })
  .png({ quality: 90 })
  .toBuffer();
```

## API Endpoints

### POST `/api/upload-avatar`

Загрузка аватара менеджера.

**Требования:**

- Авторизация (JWT токен)
- FormData с полем `file`
- Тип файла: image/\*
- Макс размер: 5MB

**Ответ:**

```json
{
  "success": true,
  "url": "/uploads/avatars/avatar_1_1234567890_abc123.jpg",
  "fileName": "avatar_1_1234567890_abc123.jpg"
}
```

### POST `/api/upload-logo`

Загрузка логотипа клиента.

**Требования:**

- Авторизация (JWT токен)
- FormData с полем `file`
- Тип файла: image/\*
- Макс размер: 5MB

**Ответ:**

```json
{
  "success": true,
  "url": "/uploads/logos/logo_1234567890_abc123.png",
  "fileName": "logo_1234567890_abc123.png"
}
```

## Утилита imageUpload.js

Центральная утилита для работы с изображениями: `src/lib/imageUpload.js`

### Функции:

#### `validateImageFile(file)`

Валидация файла перед загрузкой.

```javascript
const validation = validateImageFile(file);
if (!validation.valid) {
  console.error(validation.error);
}
```

#### `processAndSaveImage(file, type, userId)`

Обработка и сохранение изображения.

```javascript
const result = await processAndSaveImage(file, "avatars", userId);
if (result.success) {
  console.log("URL:", result.url);
}
```

#### `deleteImage(url)`

Удаление изображения по URL.

```javascript
await deleteImage("/uploads/avatars/old_avatar.jpg");
```

## Безопасность

### Валидация:

1. **Тип файла:** Только изображения (проверка MIME-type)
2. **Размер:** Максимум 5MB
3. **Авторизация:** Проверка JWT токена
4. **Уникальные имена:** timestamp + random для предотвращения коллизий

### Защита:

- Файлы сохраняются с новыми именами (не оригинальными)
- Проверка на сервере (не только на клиенте)
- Ограничение размера и типа файлов
- Автоматическая очистка старых файлов при замене

## Использование в компонентах

### Загрузка аватара:

```jsx
import AvatarUpload from "@/components/AvatarUpload";

<AvatarUpload
  currentAvatarUrl={user.avatarUrl}
  name={user.name}
  surname={user.surname}
/>;
```

### Загрузка логотипа:

```jsx
import LogoUpload from "@/components/LogoUpload";

<LogoUpload
  currentLogoUrl={formData.client_logo_url}
  onLogoChange={(url) => setFormData({ ...formData, client_logo_url: url })}
/>;
```

## Преимущества локального хранения

✅ **Простота:** Нет внешних зависимостей  
✅ **Скорость:** Быстрая отдача файлов  
✅ **Контроль:** Полный контроль над файлами  
✅ **Бесплатно:** Нет затрат на CDN  
✅ **Приватность:** Данные остаются на вашем сервере

## Недостатки

⚠️ **Масштабирование:** При большом объёме файлов нужен отдельный storage  
⚠️ **Бэкап:** Нужно включать папку uploads в бэкапы  
⚠️ **CDN:** Нет автоматического CDN (можно добавить Nginx/CloudFlare)

## Миграция с Cloudinary

Если у вас были файлы в Cloudinary:

1. Старые URL в БД останутся работать (если не удалите из Cloudinary)
2. Новые файлы будут сохраняться локально
3. Можно написать скрипт миграции для скачивания старых файлов

## Бэкап

Не забудьте включить папку `/public/uploads/` в ваши бэкапы:

```bash
# Пример бэкапа
tar -czf backup_$(date +%Y%m%d).tar.gz public/uploads/
```

## Production

Для production рекомендуется:

1. Настроить Nginx для отдачи статики
2. Добавить CloudFlare для CDN
3. Настроить автоматическую очистку старых файлов
4. Мониторинг дискового пространства

## Troubleshooting

### Ошибка "Cannot write file"

- Проверьте права доступа к папке `/public/uploads/`
- На Linux: `chmod 755 public/uploads/`

### Изображение не отображается

- Проверьте, что файл существует в `/public/uploads/`
- Проверьте URL в базе данных
- Очистите кэш браузера

### Ошибка "Sharp is not installed"

```bash
npm install sharp
```

Если ошибка сохраняется:

```bash
npm rebuild sharp
```

