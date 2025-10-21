"use client";

import "./login-form.css";
import Logo from "../Logo";

export default function LoginForm() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e.target.email.value, e.target.password.value);
  };

  return (
    <>
      <form className="form mt-5" onSubmit={handleSubmit}>
        <div className="logo-container mb-2">
          <Logo variant={"mini"} />
        </div>
        <h4 className="text-center mb-4 form-title">Вход в систему</h4>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Введите email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Введите пароль
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
          />
        </div>

        <div className="form-btn-wrapper">
          <button className="btn btn-primary btn-form">Войти</button>
        </div>
      </form>
    </>
  );
}
