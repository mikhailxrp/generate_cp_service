import { PDFDocument } from "pdf-lib";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Определяем окружение (production = Vercel, иначе локально)
const isProduction =
  process.env.VERCEL || process.env.NODE_ENV === "production";

export async function GET(request) {
  let browser;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "id is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Используем origin из текущего запроса для надёжного получения baseUrl
    const baseUrl = new URL(request.url).origin;
    const targetUrl = `${baseUrl}/preview?id=${encodeURIComponent(id)}&print=1`;

    console.log("Starting PDF generation for URL:", targetUrl);
    console.log(
      "Environment: ",
      isProduction ? "Production (Vercel)" : "Local"
    );

    // Условный запуск Chromium в зависимости от окружения
    let page;
    if (isProduction) {
      // Production: используем @sparticuz/chromium + puppeteer для Vercel
      const chromium = (await import("@sparticuz/chromium")).default;
      const puppeteer = (await import("puppeteer-core")).default;

      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
      
      page = await browser.newPage();
      await page.setViewport({ width: 1300, height: 1000, deviceScaleFactor: 2 });
      await page.emulateMediaType("screen");
    } else {
      // Local: используем обычный playwright
      const { chromium } = await import("playwright");
      browser = await chromium.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
        ],
      });
      
      const context = await browser.newContext({
        viewport: { width: 1300, height: 1000 },
        deviceScaleFactor: 2,
      });

      page = await context.newPage();
      await page.emulateMedia({ media: "screen" });
    }
    await page.goto(targetUrl, { 
      waitUntil: isProduction ? "networkidle0" : "networkidle",
      timeout: 120000 
    });

    await page.evaluate(async () => {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      const images = Array.from(document.images || []);
      const bgUrls = Array.from(document.querySelectorAll("*"))
        .map((el) => getComputedStyle(el).backgroundImage)
        .filter((v) => v && v !== "none")
        .flatMap((bg) => {
          // background-image: url("...") , url('...') ...
          const urls = [];
          const re = /url\(("|'|)(.*?)\1\)/g;
          let m;
          while ((m = re.exec(bg)) !== null) urls.push(m[2]);
          return urls;
        });

      await Promise.all([
        ...images.map((img) =>
          img.complete && img.naturalWidth > 0
            ? Promise.resolve()
            : new Promise((resolve) => {
                img.addEventListener("load", resolve, { once: true });
                img.addEventListener("error", resolve, { once: true });
              })
        ),
        ...bgUrls.map(
          (src) =>
            new Promise((resolve) => {
              const i = new Image();
              i.onload = () => resolve(null);
              i.onerror = () => resolve(null);
              i.src = src;
            })
        ),
      ]);
    });

    // Найти все страницы для PDF
    const pagesCount = await page.evaluate(() => {
      return document.querySelectorAll("#pdf-root > .pdf-page").length;
    });

    console.log("Found pages count:", pagesCount);

    if (!pagesCount || pagesCount < 1) {
      throw new Error(
        "No printable pages found. Check if preview page renders correctly with data."
      );
    }

    const pdfBuffers = [];

    for (let i = 0; i < pagesCount; i++) {
      // Показать только текущий блок, остальные скрыть
      await page.evaluate((visibleIndex) => {
        const pages = Array.from(
          document.querySelectorAll("#pdf-root > .pdf-page")
        );
        pages.forEach((el, idx) => {
          el.style.display = idx === visibleIndex ? "block" : "none";
        });
        // Убрать внешние отступы у контейнеров
        const container = document.querySelector(".container");
        if (container && container instanceof HTMLElement) {
          container.style.margin = "0";
          container.style.padding = "0";
        }
      }, i);

      // Рассчитать размер текущего видимого блока по индексу
      const { width, height } = await page.$$eval(
        "#pdf-root > .pdf-page",
        (nodes, visibleIndex) => {
          const el = nodes[visibleIndex];
          if (!el) return { width: 0, height: 0 };
          const rect = el.getBoundingClientRect();
          return {
            width: Math.ceil(rect.width),
            height: Math.ceil(rect.height),
          };
        },
        i
      );

      // Не переопределяем глобальные стили страницы, рендерим как есть

      // Сформировать PDF ровно по размеру блока (без A4)
      const widthIn = width / 96; // 96 dpi
      const heightIn = height / 96;
      const buf = await page.pdf({
        width: `${widthIn}in`,
        height: `${heightIn}in`,
        printBackground: true,
        margin: { top: "0", right: "0", bottom: "0", left: "0" },
        preferCSSPageSize: false,
        pageRanges: "1",
      });
      pdfBuffers.push(buf);
    }

    // Объединить все страницы в один PDF
    const merged = await PDFDocument.create();
    for (const buf of pdfBuffers) {
      const doc = await PDFDocument.load(buf);
      const copied = await merged.copyPages(doc, [0]);
      merged.addPage(copied[0]);
    }
    const outBuffer = await merged.save();

    await page.close();
    await browser.close();

    return new Response(outBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="kp_${id}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    console.error("Error stack:", error?.stack);
    try {
      if (browser) await browser.close();
    } catch {}
    return new Response(
      JSON.stringify({
        error: "Failed to generate PDF",
        message: String(error?.message || error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
