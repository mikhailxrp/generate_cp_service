"use client";

import { useState, useRef } from "react";
import { updateAvatar } from "@/app/actions/updateAvatar";
import { showToast } from "@/lib/toast";

export default function AvatarUpload({ currentAvatarUrl, name, surname }) {
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const getInitials = (name, surname) => {
    return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  };

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

      const response = await fetch("/api/upload-avatar", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        showToast.error(data.error || "Ошибка при загрузке");
        return;
      }

      // Обновляем аватар в БД
      const updateResult = await updateAvatar(data.url);

      if (!updateResult.success) {
        showToast.error(updateResult.error || "Ошибка при сохранении");
        return;
      }

      setAvatarUrl(data.url);
      showToast.success("Аватар успешно обновлен");
    } catch (error) {
      console.error("Avatar upload error:", error);
      showToast.error("Ошибка при загрузке аватара");
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

  return (
    <div className="profile-avatar-wrapper">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={`${name} ${surname}`}
          className="profile-avatar-img"
        />
      ) : (
        <div className="profile-avatar-placeholder">
          {getInitials(name, surname)}
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
      <button
        className="btn btn-sm btn-outline-primary mt-3"
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
            <i className="bi bi-camera"></i> Изменить фото
          </>
        )}
      </button>
    </div>
  );
}
