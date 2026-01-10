"use client";

import { useState, useRef } from "react";
import { showToast } from "@/lib/toast";

export default function LogoUpload({ currentLogoUrl, onLogoChange }) {
  const [logoUrl, setLogoUrl] = useState(currentLogoUrl);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверка типа файла
    if (!file.type.startsWith("image/")) {
      showToast.error("Файл должен быть изображением");
      return;
    }

    // Проверка размера
    if (file.size > 5 * 1024 * 1024) {
      showToast.error("Размер файла не должен превышать 5MB");
      return;
    }

    setIsUploading(true);

    try {
      // Загружаем файл на сервер
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-logo", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        showToast.error(data.error || "Ошибка при загрузке");
        return;
      }

      setLogoUrl(data.url);
      showToast.success("Логотип успешно загружен");

      // Передаём URL родительскому компоненту
      if (onLogoChange) {
        onLogoChange(data.url);
      }
    } catch (error) {
      console.error("Logo upload error:", error);
      showToast.error("Ошибка при загрузке логотипа");
    } finally {
      setIsUploading(false);
      // Очищаем input для возможности загрузить тот же файл снова
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setLogoUrl(null);
    if (onLogoChange) {
      onLogoChange(null);
    }
    showToast.success("Логотип удалён");
  };

  return (
    <div className="logo-upload-wrapper">
      {logoUrl ? (
        <div className="logo-preview-container">
          <img
            src={logoUrl}
            alt="Логотип клиента"
            className="logo-preview-img"
            style={{
              maxWidth: "200px",
              maxHeight: "100px",
              objectFit: "contain",
              border: "1px solid #dee2e6",
              borderRadius: "4px",
              padding: "8px",
              backgroundColor: "#f8f9fa",
            }}
          />
          <div className="mt-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-primary me-2"
              onClick={handleButtonClick}
              disabled={isUploading}
            >
              <i className="bi bi-arrow-repeat"></i> Заменить
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={handleRemove}
              disabled={isUploading}
            >
              <i className="bi bi-trash"></i> Удалить
            </button>
          </div>
        </div>
      ) : (
        <div>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleButtonClick}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Загрузка...
              </>
            ) : (
              <>
                <i className="bi bi-upload"></i> Загрузить логотип
              </>
            )}
          </button>
          <div className="form-text mt-1">
            Рекомендуемый размер: 800x400px. Макс. 5MB
          </div>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
    </div>
  );
}

