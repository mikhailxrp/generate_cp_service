import "../../globals.css";
import LoginForm from "@/components/login-form/LoginForm";

export const metadata = {
  title: "САНХОРС | Вход",
  description: "Вход в систему",
};

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-4">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
