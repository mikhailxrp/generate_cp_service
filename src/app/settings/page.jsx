import Header from "@/components/header/Header";

export const metadata = {
  title: "Настройки",
  description: "Настройки генератора КП",
};

export default function Settings() {
  return (
    <>
      <Header />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1>Настройки</h1>
          </div>
        </div>
      </div>
    </>
  );
}
