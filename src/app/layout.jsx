import { Montserrat } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import BootstrapClient from "./BootstrapClient";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});
export const metadata = {
  title: "САНХОРС | Генератор КП",
  description:
    "Генерация коммерческих предложений для клиентов компании САНХОРС",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className={montserrat.className}>
        <BootstrapClient />
        <main>{children}</main>
      </body>
    </html>
  );
}
