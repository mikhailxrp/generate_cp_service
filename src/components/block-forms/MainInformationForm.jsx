"use client";
import { useState } from "react";
import "../style-components.css";
import { updateMainInfoAction } from "@/app/actions/updateMainInfo";

export default function MainInformationForm({ step, id }) {
  const [formData, setFormData] = useState({
    client_name: "",
    client_address: "",
    client_type: "B2B",
    client_class: "",
    system_type: "network", // дефолтное значение
    type_area: "flat_south",
    directions_count: "1", // дефолтное значение
    ses_power_kw: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const getDirectionOptions = (typeArea) => {
    if (typeArea === "flat_east-west" || typeArea === "carpot_east-west") {
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Если изменился type_area, сбрасываем directions_count
    if (name === "type_area") {
      const newFormData = { ...formData, [name]: value };
      const availableOptions = getDirectionOptions(value);
      newFormData.directions_count = availableOptions[0].value;
      setFormData(newFormData);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const sendFormData = async (e) => {
    e.preventDefault();
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
      }
    } catch (err) {
      console.error("Ошибка при обновлении данных:", err);
      setError("Не удалось сохранить данные. Попробуйте еще раз.");
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
            Название клиента
          </label>
          <input
            type="text"
            className="form-control"
            id="client-name"
            name="client_name"
            value={formData.client_name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="client-address" className="form-label">
            Адрес клиента
          </label>
          <input
            type="text"
            className="form-control"
            id="client-address"
            name="client_address"
            value={formData.client_address}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="client-type" className="form-label">
            Тип клиента
          </label>
          <select
            className="form-select"
            id="client-type"
            name="client_type"
            value={formData.client_type}
            onChange={handleChange}
          >
            <option value="B2B">Юридическое лицо</option>
            <option value="B2C">Физическое лицо</option>
          </select>
        </div>

        {formData.client_type === "B2B" && (
          <div className="mb-3">
            <label htmlFor="client-class" className="form-label">
              Класс клиента
            </label>
            <select
              className="form-select"
              id="client-class"
              name="client_class"
              value={formData.client_class}
              onChange={handleChange}
            >
              <option value="simple">Простой</option>
              <option value="with-requests">С запросами</option>
              <option value="with-project">С проектом</option>
            </select>
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="system-type" className="form-label">
            Тип системы
          </label>
          <select
            className="form-select"
            id="system-type"
            name="system_type"
            value={formData.system_type}
            onChange={handleChange}
          >
            <option value="network">Сетевая</option>
            <option value="hybrid">Гибридная</option>
            <option value="independent">Автономная</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="type-area" className="form-label">
            Тип площадки
          </label>
          <select
            className="form-select"
            id="type-area"
            name="type_area"
            value={formData.type_area}
            onChange={handleChange}
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
            <option value="facade">Фасад</option>
            <option value="other">Другое</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="directions-count" className="form-label">
            Количество направлений
          </label>
          <select
            className="form-select"
            id="directions-count"
            name="directions_count"
            value={formData.directions_count}
            onChange={handleChange}
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
            Мощность СЭС
          </label>
          <input
            type="text"
            className="form-control"
            id="ses-power-kw"
            name="ses_power_kw"
            value={formData.ses_power_kw}
            onChange={handleChange}
          />
          <div id="ses-power-kw" className="form-text">
            кВт
          </div>
        </div>

        <div className="mb-3 mt-4 btn-wrapper">
          <button
            className="btn btn-primary"
            onClick={sendFormData}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Сохраняю..." : "Добавить блок"}
          </button>
          {error && <p className="text-danger mt-2 text-center">{error}</p>}
        </div>
      </div>
    </>
  );
}
