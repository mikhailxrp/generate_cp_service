"use client";
import Link from "next/link";
import Logo from "../Logo";
import "./header.css";

export default function Header() {
  return (
    <header>
      <nav className="navbar">
        <div className="container-fluid">
          <div className="header-content-left">
            <div className="logo-container">
              <Logo variant="full" />
            </div>

            <div className="header-nav-links menu">
              <Link className="btn btn-light" href="/">
                Главная
              </Link>
              <Link className="btn btn-light" href="/prewiev">
                Просмотр КП
              </Link>
              <Link className="btn btn-light" href="/pricelist">
                Комплектующие
              </Link>
              <Link className="btn btn-light" href="/settings">
                Настройки
              </Link>
            </div>
          </div>
          <div className="header-content-rigth">
            <div className="profile">
              <Link href="/profile">M</Link>
            </div>
            <div className="logout">
              <Link href="/">
                <i className="bi bi-box-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
