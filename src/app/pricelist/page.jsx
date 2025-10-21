import Header from "@/components/header/Header";

export const metadata = {
  title: "Комплектующие",
  description: "Комплектующие для генерации КП",
};

export default function Pricelist() {
  return (
    <>
      <Header />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1>Pricelist</h1>
          </div>
        </div>
      </div>
    </>
  );
}
