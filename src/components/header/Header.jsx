"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "../Logo";
import { logoutAction } from "@/app/actions/logout";
import { useUser } from "@/hooks/useUser";
import "./header.css";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, getInitials } = useUser();

  // Ensure component is mounted before using pathname to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Закрываем меню при изменении маршрута
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Блокируем скролл при открытом меню
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // Закрываем меню при изменении размера окна (переход на десктоп)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logoutAction();
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/login");
    }
  };

  return (
    <header className="header">
      <nav className="navbar">
        <div className="container-fluid">
          <div className="header-content-left">
            <div className="logo-container">
              <Logo variant="full" />
            </div>

            {/* Desktop Navigation */}
            <div className="header-nav-links desktop-menu">
              <Link
                className={`btn btn-light ${
                  mounted && pathname === "/" ? "active" : ""
                }`}
                href="/"
              >
                Главная
              </Link>
              <Link
                className={`btn btn-light ${
                  mounted && pathname === "/preview" ? "active" : ""
                }`}
                href="/preview"
              >
                Просмотр КП
              </Link>
              <Link
                className={`btn btn-light ${
                  mounted && pathname === "/catalog" ? "active" : ""
                }`}
                href="/catalog"
              >
                Каталог
              </Link>
              <Link
                className={`btn btn-light ${
                  mounted && pathname === "/settings" ? "active" : ""
                }`}
                href="/settings"
              >
                Настройки
              </Link>
            </div>
          </div>

          <div className="header-content-right">
            <div className="profile">
              <Link href="/profile" aria-label="Профиль">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={`${user.name} ${user.surname}`}
                    className="profile-avatar-img"
                  />
                ) : (
                  getInitials
                )}
              </Link>
            </div>
            <div className="logout">
              <button onClick={handleLogout} aria-label="Выход">
                <i className="bi bi-box-arrow-right"></i>
              </button>
            </div>

            {/* Hamburger Button */}
            <button
              className={`hamburger ${isMenuOpen ? "active" : ""}`}
              onClick={toggleMenu}
              aria-label="Меню"
              aria-expanded={isMenuOpen}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
          <div className="mobile-menu-content">
            <div className="mobile-menu-header">
              <div className="mobile-user-info">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={`${user.name} ${user.surname}`}
                    className="profile-avatar profile-avatar-img"
                  />
                ) : (
                  <div className="profile-avatar">{getInitials}</div>
                )}
                <span className="user-email">
                  {user?.email || "Загрузка..."}
                </span>
              </div>
            </div>

            <nav className="mobile-nav-links">
              <Link
                className={`mobile-nav-link ${
                  mounted && pathname === "/" ? "active" : ""
                }`}
                href="/"
                onClick={closeMenu}
              >
                <i className="bi bi-house-door"></i>
                <span>Главная</span>
              </Link>
              <Link
                className={`mobile-nav-link ${
                  mounted && pathname === "/preview" ? "active" : ""
                }`}
                href="/preview"
                onClick={closeMenu}
              >
                <i className="bi bi-eye"></i>
                <span>Просмотр КП</span>
              </Link>
              <Link
                className={`mobile-nav-link ${
                  mounted && pathname === "/catalog" ? "active" : ""
                }`}
                href="/catalog"
                onClick={closeMenu}
              >
                <i className="bi bi-grid"></i>
                <span>Каталог</span>
              </Link>
              <Link
                className={`mobile-nav-link ${
                  mounted && pathname === "/settings" ? "active" : ""
                }`}
                href="/settings"
                onClick={closeMenu}
              >
                <i className="bi bi-gear"></i>
                <span>Настройки</span>
              </Link>
            </nav>

            <div className="mobile-menu-footer">
              <Link
                className="mobile-nav-link profile-link"
                href="/profile"
                onClick={closeMenu}
              >
                <i className="bi bi-person-circle"></i>
                <span>Профиль</span>
              </Link>
              <button
                className="mobile-nav-link logout-link"
                onClick={() => {
                  closeMenu();
                  handleLogout();
                }}
              >
                <i className="bi bi-box-arrow-right"></i>
                <span>Выход</span>
              </button>
            </div>
          </div>
        </div>

        {/* Overlay */}
        {isMenuOpen && (
          <div className="mobile-menu-overlay" onClick={closeMenu}></div>
        )}
      </nav>
    </header>
  );
}
