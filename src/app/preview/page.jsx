import Header from "@/components/header/Header";

export const metadata = {
  title: "Просмотр КП",
  description:
    "Просмотр коммерческих предложений для клиентов компании САНХОРС",
};

export default function Prewiev() {
  return (
    <>
      <Header />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1>Prewiev</h1>
          </div>
        </div>
      </div>
    </>
  );
}
