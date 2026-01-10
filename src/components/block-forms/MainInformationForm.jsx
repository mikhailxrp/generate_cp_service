"use client";
import { useState, useEffect } from "react";
import "../style-components.css";
import { updateMainInfoAction } from "@/app/actions/updateMainInfo";
import LogoUpload from "@/components/LogoUpload";

export default function MainInformationForm({ step, id, cpData }) {
  const [formData, setFormData] = useState({
    client_name: "",
    client_address: "",
    client_type: "B2B",
    client_class: "",
    client_logo_url: "",
    system_type: "network", // дефолтное значение
    type_area: "flat_south",
    directions_count: "1", // дефолтное значение
    ses_power_kw: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Загрузка данных из cpData при монтировании
  useEffect(() => {
    if (cpData) {
      setFormData({
        client_name: cpData.clientName || "",
        client_address: cpData.clientAddress || "",
        client_type: cpData.clientType || "B2B",
        client_class: cpData.clientClass || "",
        client_logo_url: cpData.clientLogoUrl || "",
        system_type: cpData.systemType || "network",
        type_area: cpData.typeArea || "flat_south",
        directions_count: String(cpData.directionsCount || 1),
        ses_power_kw: String(cpData.sesPower || ""),
      });
    }
  }, [cpData]);

  // Валидация только после попытки отправки
  useEffect(() => {
    if (hasAttemptedSubmit) {
      validateForm();
    }
  }, [formData, hasAttemptedSubmit]);

  const getDirectionOptions = (typeArea) => {
    if (typeArea === "flat_east-west") {
      return [{ value: "2", label: "2" }];
    } else if (typeArea === "carpot_east-west") {
      return [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
      ];
    } else if (typeArea === "other") {
      return [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
      ];
    } else {
      return [{ value: "1", label: "1" }];
    }
  };

  const validateForm = () => {
    const errors = {};

    // Валидация всех полей
    if (!formData.client_name.trim()) {
      errors.client_name = "Название клиента обязательно для заполнения";
    } else if (formData.client_name.trim().length < 2) {
      errors.client_name =
        "Название клиента должно содержать минимум 2 символа";
    }

    if (!formData.client_address.trim()) {
      errors.client_address = "Адрес клиента обязателен для заполнения";
    } else if (formData.client_address.trim().length < 5) {
      errors.client_address = "Адрес должен содержать минимум 5 символов";
    }

    if (formData.client_type === "B2B" && !formData.client_class) {
      errors.client_class = "Класс клиента обязателен для юридических лиц";
    }

    if (!formData.ses_power_kw.trim()) {
      errors.ses_power_kw = "Мощность СЭС обязательна для заполнения";
    } else if (!/^\d+(\.\d+)?$/.test(formData.ses_power_kw.trim())) {
      errors.ses_power_kw = "Мощность должна быть числом (например: 5 или 5.5)";
    } else if (parseFloat(formData.ses_power_kw) <= 0) {
      errors.ses_power_kw = "Мощность должна быть больше 0";
    } else if (parseFloat(formData.ses_power_kw) > 1000) {
      errors.ses_power_kw = "Мощность не может превышать 1000 кВт";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Если изменился type_area, сбрасываем directions_count
    if (name === "type_area") {
      const newFormData = { ...formData, [name]: value };
      const availableOptions = getDirectionOptions(value);
      // Для flat_east-west всегда ставим 2
      newFormData.directions_count =
        value === "flat_east-west" ? "2" : availableOptions[0].value;
      setFormData(newFormData);
    } else if (name === "client_type") {
      // При изменении типа клиента сбрасываем класс клиента
      const newFormData = { ...formData, [name]: value, client_class: "" };
      setFormData(newFormData);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const sendFormData = async (e) => {
    e.preventDefault();

    // Отмечаем, что была попытка отправки
    setHasAttemptedSubmit(true);

    // Валидация формы перед отправкой
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await updateMainInfoAction(id, formData, step);
      if (response.success) {
        // Сбрасываем форму к дефолтным значениям
        setFormData({
          client_name: "",
          client_address: "",
          client_type: "B2B",
          client_class: "",
          system_type: "network",
          type_area: "flat_south",
          directions_count: "1",
          ses_power_kw: "",
        });
        setValidationErrors({});
        setHasAttemptedSubmit(false);
      }
    } catch (err) {
      // console.error("Ошибка при обновлении данных:", err);
      // setError("Не удалось сохранить данные. Попробуйте еще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <div className="wrapper-form px-5 mt-3">
        <h2 className="title-block text-center">Блок основная информация</h2>
        <div className="mb-3">
          <label htmlFor="client-name" className="form-label">
            Название компании клиента <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${
              hasAttemptedSubmit && validationErrors.client_name
                ? "is-invalid"
                : ""
            }`}
            id="client-name"
            name="client_name"
            value={formData.client_name}
            onChange={handleChange}
            required
          />
          {hasAttemptedSubmit && validationErrors.client_name && (
            <div className="invalid-feedback">
              {validationErrors.client_name}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Логотип компании клиента</label>
          <LogoUpload
            currentLogoUrl={formData.client_logo_url}
            onLogoChange={(url) =>
              setFormData({ ...formData, client_logo_url: url || "" })
            }
          />
        </div>

        <div className="mb-3">
          <label htmlFor="client-address" className="form-label">
            Адрес клиента <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${
              hasAttemptedSubmit && validationErrors.client_address
                ? "is-invalid"
                : ""
            }`}
            id="client-address"
            name="client_address"
            value={formData.client_address}
            onChange={handleChange}
            title="Введите адрес клиента или координаты в формате lat - lon"
            placeholder="Адрес или координаты (lat - lon)"
            required
          />
          {hasAttemptedSubmit && validationErrors.client_address && (
            <div className="invalid-feedback">
              {validationErrors.client_address}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="client-type" className="form-label">
            Тип клиента <span className="text-danger">*</span>
          </label>
          <select
            className="form-select"
            id="client-type"
            name="client_type"
            value={formData.client_type}
            onChange={handleChange}
            required
          >
            <option value="B2B">Юридическое лицо</option>
            <option value="B2C">Физическое лицо</option>
          </select>
        </div>

        {formData.client_type === "B2B" && (
          <div className="mb-3">
            <label htmlFor="client-class" className="form-label">
              Класс клиента <span className="text-danger">*</span>
            </label>
            <select
              className={`form-select ${
                hasAttemptedSubmit && validationErrors.client_class
                  ? "is-invalid"
                  : ""
              }`}
              id="client-class"
              name="client_class"
              value={formData.client_class}
              onChange={handleChange}
              required
            >
              <option value="">Выберите класс клиента</option>
              <option value="simple">Простой</option>
              <option value="with-requests">С запросами</option>
              <option value="with-project">С проектом</option>
            </select>
            {hasAttemptedSubmit && validationErrors.client_class && (
              <div className="invalid-feedback">
                {validationErrors.client_class}
              </div>
            )}
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="system-type" className="form-label">
            Тип системы <span className="text-danger">*</span>
          </label>
          <select
            className="form-select"
            id="system-type"
            name="system_type"
            value={formData.system_type}
            onChange={handleChange}
            required
          >
            <option value="network">Сетевая</option>
            <option value="hybrid">Гибридная</option>
            <option value="independent">Автономная</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="type-area" className="form-label">
            Тип площадки <span className="text-danger">*</span>
          </label>
          <select
            className="form-select"
            id="type-area"
            name="type_area"
            value={formData.type_area}
            onChange={handleChange}
            required
          >
            <option value="flat_south">Плоская(юг)</option>
            <option value="flat_east-west">Плоская(восток-запад)</option>
            <option value="metal">Металл/мягкая черепица</option>
            <option value="classic_tiles">Классическая черепица</option>
            <option value="slate">Шифер</option>
            <option value="carpot_south">Карпот(юг)</option>
            <option value="carpot_east-west">Карпот(восток-запад)</option>
            <option value="canopy">Навес</option>
            <option value="ground">Наземка</option>
            {/* <option value="facade">Фасад</option> */}
            {/* <option value="other">Другое</option> */}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="directions-count" className="form-label">
            Количество направлений <span className="text-danger">*</span>
          </label>
          <select
            className="form-select"
            id="directions-count"
            name="directions_count"
            value={formData.directions_count}
            onChange={handleChange}
            required
          >
            {getDirectionOptions(formData.type_area).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="ses-power-kw" className="form-label">
            Мощность СЭС <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${
              hasAttemptedSubmit && validationErrors.ses_power_kw
                ? "is-invalid"
                : ""
            }`}
            id="ses-power-kw"
            name="ses_power_kw"
            value={formData.ses_power_kw}
            onChange={handleChange}
            placeholder="Например: 5 или 5.5"
            required
          />
          <div id="ses-power-kw-help" className="form-text">
            кВт
          </div>
          {hasAttemptedSubmit && validationErrors.ses_power_kw && (
            <div className="invalid-feedback">
              {validationErrors.ses_power_kw}
            </div>
          )}
        </div>

        <div className="mb-3 mt-4 btn-wrapper">
          <button
            className="btn btn-primary"
            onClick={sendFormData}
            disabled={
              isSubmitting ||
              (hasAttemptedSubmit && Object.keys(validationErrors).length > 0)
            }
          >
            {isSubmitting ? "Сохраняю..." : "Добавить блок"}
          </button>
          {error && <p className="text-danger mt-2 text-center">{error}</p>}
          {hasAttemptedSubmit && Object.keys(validationErrors).length > 0 && (
            <p className="text-warning mt-2 text-center">
              Пожалуйста, исправьте ошибки в форме
            </p>
          )}
        </div>
      </div>
    </>
  );
}
