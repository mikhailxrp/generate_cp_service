/**
 * 🧪 Тестовый скрипт для проверки работы лоадера
 * 
 * Запуск: node scripts/test-loader.js
 */

// Симуляция класса ImportLoader (упрощенная версия)
class ImportLoader {
  constructor(categoryName) {
    this.categoryName = categoryName;
    this.frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
    this.currentFrame = 0;
    this.interval = null;
    this.processed = 0;
    this.lastUpdate = Date.now();
  }

  start() {
    // Очистка консоли и начальное сообщение
    console.clear();
    console.log(`\n${"=".repeat(60)}`);
    console.log(`🚀 Импорт: ${this.categoryName}`);
    console.log(`${"=".repeat(60)}\n`);

    // Показываем первый кадр сразу
    this._render();

    this.interval = setInterval(() => {
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
      this._render();
    }, 80);
  }

  _render() {
    const spinner = this.frames[this.currentFrame];
    const elapsed = Math.floor((Date.now() - this.lastUpdate) / 1000);
    const line = `${spinner} Обработано строк: ${this.processed} | Время: ${elapsed}s`;
    
    // Простой метод — перезаписываем строку с запасом пробелов
    // Работает во всех терминалах (включая PowerShell без ANSI)
    const paddedLine = line.padEnd(60, " ");
    process.stdout.write(`\r${paddedLine}`);
  }

  update(count) {
    this.processed = count;
    // Немедленно обновляем вывод при ручном апдейте
    if (this.interval) {
      this._render();
    }
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      // Очищаем строку лоадера перед финальным выводом
      process.stdout.write("\r" + " ".repeat(60) + "\r");
    }
  }
}

// Функция для задержки
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Тестовая функция
async function testLoader() {
  const loader = new ImportLoader("Тестовая категория");
  
  console.log("⏳ Запуск лоадера...");
  await sleep(500); // Маленькая задержка перед стартом
  
  loader.start();
  
  // Симулируем обработку данных
  for (let i = 1; i <= 50; i++) {
    await sleep(100); // Симулируем обработку строки
    loader.update(i);
  }
  
  loader.stop();
  
  console.log("\n\n✅ Лоадер работает корректно!");
  console.log("📊 Обработано строк: 50");
}

// Запуск теста
testLoader().catch((err) => {
  console.error("❌ Ошибка теста:", err);
  process.exit(1);
});

