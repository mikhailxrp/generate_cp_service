import Header from "@/components/header/Header";
import "./globals.css";

export const metadata = {
  title: "САНХОРС | Генератор Коммерческих предложений",
  description: "Генератор Коммерческих предложений",
};

export default function Home() {
  return (
    <>
      <Header />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1>Главная страница</h1>
          </div>
        </div>
      </div>
    </>
  );
}
