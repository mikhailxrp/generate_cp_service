"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

export default function ArchivePage() {
  const [archiveData, setArchiveData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [visibleCount, setVisibleCount] = useState(12);
  const [projectSearch, setProjectSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    async function fetchArchive() {
      try {
        const archiveResponse = await fetch("/api/main-information");
        if (archiveResponse.ok) {
          const archiveResult = await archiveResponse.json();
          if (archiveResult.success) {
            setArchiveData(archiveResult.data);
          }
        }
      } catch (error) {
        console.error("Ошибка при получении архива:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchArchive();
  }, []);

  // Функция группировки по датам
  const groupByDate = (data) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const groups = {
      today: [],
      yesterday: [],
      week: [],
      month: [],
      older: [],
    };

    data.forEach((item) => {
      const itemDate = new Date(item.createdAt);
      itemDate.setHours(0, 0, 0, 0);

      if (itemDate.getTime() === today.getTime()) {
        groups.today.push(item);
      } else if (itemDate.getTime() === yesterday.getTime()) {
        groups.yesterday.push(item);
      } else if (itemDate >= weekAgo) {
        groups.week.push(item);
      } else if (itemDate >= monthAgo) {
        groups.month.push(item);
      } else {
        groups.older.push(item);
      }
    });

    return groups;
  };

  const groupedData = groupByDate(archiveData);

  const getFilteredData = () => {
    switch (activeTab) {
      case "today":
        return groupedData.today;
      case "yesterday":
        return groupedData.yesterday;
      case "week":
        return groupedData.week;
      case "month":
        return groupedData.month;
      case "older":
        return groupedData.older;
      default:
        return archiveData;
    }
  };

  // Сброс счетчика при смене вкладки
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [activeTab, projectSearch]);

  const dateFilteredData = getFilteredData();
  const filteredData = dateFilteredData.filter((item) => {
    if (!projectSearch.trim()) return true;
    if (!item.projectNumber) return false;
    return String(item.projectNumber)
      .toLowerCase()
      .includes(projectSearch.trim().toLowerCase());
  });
  const visibleData = filteredData.slice(0, visibleCount);
  const hasMore = filteredData.length > visibleCount;

  const loadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Вы уверены, что хотите удалить это КП? Действие необратимо."
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      const response = await fetch(`/api/main-information/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.error("Ошибка при удалении КП:", await response.text());
        alert("Не удалось удалить КП. Попробуйте еще раз.");
        return;
      }

      setArchiveData((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Ошибка при удалении КП:", error);
      alert("Произошла ошибка при удалении КП. Проверьте консоль.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Header />
        <div
          className="container"
          style={{ flex: 1, display: "flex", alignItems: "center" }}
        >
          <div className="row justify-content-center w-100">
            <div className="col-lg-10">
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Загрузка...</span>
                </div>
                <p className="mt-2">Загрузка данных...</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Header />
      <div className="container my-5" style={{ flex: 1 }}>
        <h2 className="text-center mb-4">Архив коммерческих предложений</h2>

        {/* Поиск по номеру проекта */}
        <div className="row mb-4">
          <div className="col-md-6 col-lg-4 mx-auto">
            <input
              type="text"
              className="form-control"
              placeholder="Поиск по номеру проекта..."
              value={projectSearch}
              onChange={(e) => setProjectSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Вкладки фильтрации */}
        <div className="mb-4">
          <ul className="nav nav-pills justify-content-center flex-wrap gap-2">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "all" ? "active" : ""}`}
                onClick={() => setActiveTab("all")}
              >
                Все ({archiveData.length})
              </button>
            </li>
            {groupedData.today.length > 0 && (
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "today" ? "active" : ""
                    }`}
                  onClick={() => setActiveTab("today")}
                >
                  Сегодня ({groupedData.today.length})
                </button>
              </li>
            )}
            {groupedData.yesterday.length > 0 && (
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "yesterday" ? "active" : ""
                    }`}
                  onClick={() => setActiveTab("yesterday")}
                >
                  Вчера ({groupedData.yesterday.length})
                </button>
              </li>
            )}
            {groupedData.week.length > 0 && (
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "week" ? "active" : ""}`}
                  onClick={() => setActiveTab("week")}
                >
                  Неделя ({groupedData.week.length})
                </button>
              </li>
            )}
            {groupedData.month.length > 0 && (
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "month" ? "active" : ""
                    }`}
                  onClick={() => setActiveTab("month")}
                >
                  Месяц ({groupedData.month.length})
                </button>
              </li>
            )}
            {groupedData.older.length > 0 && (
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "older" ? "active" : ""
                    }`}
                  onClick={() => setActiveTab("older")}
                >
                  Старые ({groupedData.older.length})
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* Список КП */}
        <div className="row g-4 mb-4">
          {filteredData.length === 0 ? (
            <div className="col-12 text-center text-muted py-5">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-3"
                style={{ opacity: 0.3 }}
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
              <p className="fs-5">Нет КП в этой категории</p>
            </div>
          ) : (
            visibleData.map((item) => (
              <div key={item.id} className="col-md-6 col-lg-4">
                <div
                  className="card h-100 shadow-sm"
                  style={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    border: "1px solid #e0e0e0",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 24px rgba(0,0,0,0.15)";
                    e.currentTarget.style.borderColor = "#0d6efd";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(0,0,0,0.1)";
                    e.currentTarget.style.borderColor = "#e0e0e0";
                  }}
                  onClick={() => {
                    window.location.href = `/preview?id=${item.id}`;
                  }}
                >
                  <div className="card-body d-flex flex-column">
                    <h5
                      className="card-title text-truncate mb-3"
                      title={item.clientName}
                    >
                      {item.clientName}
                    </h5>
                    <p className="card-text text-muted small mb-3">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ marginRight: "6px", marginTop: "-2px" }}
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      {item.clientAddress}
                    </p>
                    <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                      <span
                        className="badge bg-primary"
                        style={{ fontSize: "0.85rem" }}
                      >
                        ⚡ {item.sesPower} кВт
                      </span>
                      <span
                        className="badge bg-secondary"
                        style={{ fontSize: "0.85rem" }}
                      >
                        {item.systemType === "network"
                          ? "🔌 Сетевая"
                          : "🔋 Гибридная"}
                      </span>
                    </div>
                    {item.totalCost && (
                      <p
                        className="mb-2 fw-bold text-success"
                        style={{ fontSize: "1.1rem" }}
                      >
                        {Number(item.totalCost).toLocaleString("ru-RU")} ₽
                      </p>
                    )}
                    {item.projectNumber && (
                      <p className="text-muted small mb-2">
                        📋 Проект: {item.projectNumber}
                      </p>
                    )}
                    <p className="text-muted small mb-0 mt-auto">
                      🕐{" "}
                      {new Date(item.createdAt).toLocaleDateString("ru-RU", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger mt-3"
                      disabled={deletingId === item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                    >
                      {deletingId === item.id ? "Удаление..." : "Удалить КП"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Кнопка "Загрузить еще" */}
        {hasMore && (
          <div className="row mb-5">
            <div className="col-12 text-center">
              <button
                onClick={loadMore}
                className="btn btn-outline-primary btn-lg"
                style={{
                  padding: "12px 40px",
                  fontSize: "16px",
                  fontWeight: "600",
                  borderRadius: "12px",
                  transition: "all 0.3s ease",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginRight: "8px", marginTop: "-2px" }}
                >
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <polyline points="1 20 1 14 7 14"></polyline>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
                Загрузить еще (
                {Math.min(ITEMS_PER_PAGE, filteredData.length - visibleCount)})
              </button>
            </div>
          </div>
        )}

        {/* Кнопка создать КП */}
        <div className="row">
          <div className="col-12 text-center">
            <Link
              href="/"
              className="btn btn-primary btn-lg"
              style={{
                padding: "14px 40px",
                fontSize: "18px",
                fontWeight: "600",
                borderRadius: "12px",
                boxShadow: "0 4px 15px rgba(13, 110, 253, 0.3)",
                transition: "all 0.3s ease",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: "8px", marginTop: "-2px" }}
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              Создать новое КП
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
