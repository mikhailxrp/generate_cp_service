This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## 📋 CSV Price Import System

Проект включает полноценную систему импорта прайса из CSV-файлов в базу данных.

### 🚀 Быстрый старт

```bash
# Импорт инверторов
node scripts/importInvertersFromCsv.js

# Импорт солнечных модулей
node scripts/importModulesFromCsv.js

# Проверка результата
node scripts/check-categories.js
```

### 📚 Документация

**Начни здесь:** **[CSV_IMPORT_SYSTEM_SUMMARY.md](./CSV_IMPORT_SYSTEM_SUMMARY.md)** — обзор системы

**Полная документация:**
- **[scripts/CSV_IMPORT_INDEX.md](./scripts/CSV_IMPORT_INDEX.md)** — главный индекс всей документации
- **[scripts/CSV_IMPORT_QUICK_START.md](./scripts/CSV_IMPORT_QUICK_START.md)** — быстрый старт за 2 минуты
- **[scripts/CSV_IMPORT_GUIDE.md](./scripts/CSV_IMPORT_GUIDE.md)** — подробное руководство
- **[scripts/CSV_CATEGORIES_REFERENCE.md](./scripts/CSV_CATEGORIES_REFERENCE.md)** — справочник категорий
- **[scripts/CSV_CHEATSHEET.md](./scripts/CSV_CHEATSHEET.md)** — шпаргалка

### ✅ Готовые импортеры

15 готовых CSV-импортеров для всех основных категорий прайса:
- Инверторы, солнечные модули, ESS, батареи, крепёж/BOS
- Кабели, коннекторы, предохранители, лотки, эл. панели
- Трансформаторы, УЗИПы, счётчики, CPO90, PowOff

**Все команды:** [scripts/CSV_IMPORT_COMMANDS.md](./scripts/CSV_IMPORT_COMMANDS.md)