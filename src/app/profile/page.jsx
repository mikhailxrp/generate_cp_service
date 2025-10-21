import Header from "@/components/header/Header";

export const metadata = {
  title: "Профиль",
  description: "Профиль пользователя",
};

export default function Profile() {
  return (
    <>
      <Header />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1>Профиль</h1>
          </div>
        </div>
      </div>
    </>
  );
}
