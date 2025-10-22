"use client";

import { useState } from "react";
import "./login-form.css";
import Logo from "../Logo";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

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
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="password"
              name="password"
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
            >
              {showPassword ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="form-btn-wrapper">
          <button className="btn btn-primary btn-form">Войти</button>
        </div>
      </form>
    </>
  );
}
