"use client";

import { useState, useRef, useEffect } from "react";
import { updateInformationAction } from "@/app/actions/updateInformation";

export default function InformationForm({ step, id }) {
  // MultiSelect выбор боли клиента start
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  // Состояние ошибок валидации
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Ыункция валидации полей формы
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "network_phazes":
        if (!value || value === "") {
          newErrors[name] = "Выберите количество фаз сети";
        } else {
          delete newErrors[name];
        }
        break;
      case "connected_power_kw":
        if (!value || value.trim() === "") {
          newErrors[name] = "Введите подключенную мощность";
        } else if (isNaN(value) || parseFloat(value) <= 0) {
          newErrors[name] = "Введите корректное числовое значение";
        } else {
          delete newErrors[name];
        }
        break;
      case "microgeneration":
        if (!value || value === "") {
          newErrors[name] = "Выберите вариант микрогенерации";
        } else {
          delete newErrors[name];
        }
        break;
      case "monthly_consumption_kwh":
        if (!value || value.trim() === "") {
          newErrors[name] = "Введите месячное потребление";
        } else if (isNaN(value) || parseFloat(value) <= 0) {
          newErrors[name] = "Введите корректное числовое значение";
        } else {
          delete newErrors[name];
        }
        break;
      case "price_kwh":
        if (!value || value.trim() === "") {
          newErrors[name] = "Введите стоимость кВт⋅ч";
        } else if (isNaN(value) || parseFloat(value) <= 0) {
          newErrors[name] = "Введите корректное числовое значение";
        } else {
          delete newErrors[name];
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const form = document.querySelector("form.wrapper-form");
    if (!form) return false;

    const formData = new FormData(form);
    let isValid = true;
    const newErrors = {};

    // Validate required fields
    const requiredFields = [
      "network_phazes",
      "connected_power_kw",
      "microgeneration",
      "monthly_consumption_kwh",
      "price_kwh",
    ];

    requiredFields.forEach((field) => {
      const value = formData.get(field);

      // Validate each field directly without calling validateField
      switch (field) {
        case "network_phazes":
          if (!value || value === "") {
            newErrors[field] = "Выберите количество фаз сети";
            isValid = false;
          }
          break;
        case "connected_power_kw":
          if (!value || value.trim() === "") {
            newErrors[field] = "Введите подключенную мощность";
            isValid = false;
          } else if (isNaN(value) || parseFloat(value) <= 0) {
            newErrors[field] = "Введите корректное числовое значение";
            isValid = false;
          }
          break;
        case "microgeneration":
          if (!value || value === "") {
            newErrors[field] = "Выберите вариант микрогенерации";
            isValid = false;
          }
          break;
        case "monthly_consumption_kwh":
          if (!value || value.trim() === "") {
            newErrors[field] = "Введите месячное потребление";
            isValid = false;
          } else if (isNaN(value) || parseFloat(value) <= 0) {
            newErrors[field] = "Введите корректное числовое значение";
            isValid = false;
          }
          break;
        case "price_kwh":
          if (!value || value.trim() === "") {
            newErrors[field] = "Введите стоимость кВт⋅ч";
            isValid = false;
          } else if (isNaN(value) || parseFloat(value) <= 0) {
            newErrors[field] = "Введите корректное числовое значение";
            isValid = false;
          }
          break;
        default:
          break;
      }
    });

    // Update errors state
    setErrors(newErrors);

    // Mark all fields as touched
    const newTouched = {};
    requiredFields.forEach((field) => {
      newTouched[field] = true;
    });
    setTouched(newTouched);

    return isValid;
  };

  const handleFieldChange = (name, value) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  // Form data collection
  const collectFormData = () => {
    const form = document.querySelector("form.wrapper-form");
    if (!form) {
      console.error("Form element not found");
      return {};
    }

    const formData = new FormData(form);
    const data = {};

    // Collect all form fields
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }

    // Add multiselect data
    data.client_pains = selectedOptions.map((option) => option.value);
    data.client_pains_labels = selectedOptions.map((option) => option.label);

    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    if (!validateForm()) {
      console.log("Форма содержит ошибки:", errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = collectFormData();
      formData.currentStep = step;

      // Отправка данных в БД
      if (id) {
        await updateInformationAction(id, formData);
      } else {
        throw new Error("ID проекта не найден");
      }
    } catch (error) {
      console.error("Ошибка при отправке данных:", error);
      setSubmitError("Произошла ошибка при сохранении данных");
      setIsSubmitting(false);
    }
  };

  // Отслеживание изменений в реальном времени
  useEffect(() => {
    const handleFormChange = () => {
      const data = collectFormData();
      console.log("Изменения в форме:", data);
    };

    const form = document.querySelector("form.wrapper-form");
    if (form) {
      form.addEventListener("input", handleFormChange);
      form.addEventListener("change", handleFormChange);

      return () => {
        form.removeEventListener("input", handleFormChange);
        form.removeEventListener("change", handleFormChange);
      };
    }
  }, [selectedOptions]);
  const options = [
    { value: "eco_energy", label: "Экономия электроэнергии" },
    { value: "reserve_energy", label: "Резерв электроэнергии" },
    { value: "esg_compliance", label: "ESG соответствие" },
    { value: "autonomy", label: "Автономия" },
    { value: "reduction_of_payments", label: "Снижение платы" },
    { value: "electric_car_charging", label: "Зарядка электромобиля" },
    { value: "other", label: "Другое" },
  ];

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleOption = (option) => {
    setSelectedOptions((prev) =>
      prev.some((item) => item.value === option.value)
        ? prev.filter((item) => item.value !== option.value)
        : [...prev, option]
    );
  };

  const removeOption = (optionToRemove) => {
    setSelectedOptions((prev) =>
      prev.filter((option) => option.value !== optionToRemove.value)
    );
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const MultiSelect = () => (
    <div className="mb-3">
      <label htmlFor="equipment-selection" className="form-label">
        Выбор боли клиента
      </label>
      <div className="position-relative" ref={dropdownRef}>
        <div
          className="form-control d-flex flex-wrap align-items-center gap-2 p-2 multiselect-dropdown"
          style={{
            minHeight: "38px",
            cursor: "pointer",
            border: isOpen ? "2px solid #0d6efd" : "1px solid #ced4da",
            borderRadius: "0.375rem",
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedOptions.length === 0 ? (
            <span className="text-muted">Выберите боли клиента...</span>
          ) : (
            selectedOptions.map((option) => (
              <span
                key={option.value}
                className="badge bg-primary d-flex align-items-center gap-1 multiselect-badge"
                style={{ fontSize: "0.75rem" }}
              >
                {option.label}
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  style={{
                    fontSize: "0.5rem",
                    width: "0.5rem",
                    height: "0.5rem",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeOption(option);
                  }}
                />
              </span>
            ))
          )}
          <div className="ms-auto">
            <svg
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
              style={{
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            >
              <path d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
            </svg>
          </div>
        </div>

        {isOpen && (
          <div
            className="position-absolute w-100 bg-white border border-top-0 rounded-bottom shadow-lg"
            style={{
              zIndex: 1000,
              maxHeight: "200px",
              overflowY: "auto",
              borderTopLeftRadius: "0",
              borderTopRightRadius: "0",
            }}
          >
            <div className="p-2 border-bottom">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Поиск..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="py-1">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-muted">Ничего не найдено</div>
              ) : (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`px-3 py-2 d-flex align-items-center cursor-pointer multiselect-option ${
                      selectedOptions.some(
                        (item) => item.value === option.value
                      )
                        ? "bg-primary text-white"
                        : "hover-bg-light"
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleOption(option)}
                  >
                    <div className="form-check me-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={selectedOptions.some(
                          (item) => item.value === option.value
                        )}
                        onChange={() => {}}
                        style={{ pointerEvents: "none" }}
                      />
                    </div>
                    {option.label}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      <div className="form-text">Выберите основные боли клиента</div>
    </div>
  );

  // MultiSelect options end
  return (
    <>
      <form className="wrapper-form px-5">
        <h2 className="title-block text-center">Блок полная информация</h2>
        <div className="mb-3">
          <label htmlFor="ess-battery" className="form-label">
            ESS (АКБ)
          </label>
          <input
            type="text"
            className="form-control"
            id="ess-battery"
            name="ess_battery"
          />
          <div id="ess-battery-help" className="form-text">
            Ёмкость кВт⋅ч*
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="network-phazes" className="form-label">
            Количество фаз сети <span className="text-danger">*</span>
          </label>
          <select
            className={`form-select ${
              touched.network_phazes && errors.network_phazes
                ? "is-invalid"
                : ""
            }`}
            id="network-phazes"
            name="network_phazes"
            required
            onChange={(e) =>
              handleFieldChange("network_phazes", e.target.value)
            }
          >
            <option value="">Выберите количество фаз</option>
            <option value="1">1</option>
            <option value="3">3</option>
          </select>
          {touched.network_phazes && errors.network_phazes && (
            <div className="invalid-feedback">{errors.network_phazes}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="connected-power" className="form-label">
            Подключенная мощность <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            step="0.1"
            className={`form-control ${
              touched.connected_power_kw && errors.connected_power_kw
                ? "is-invalid"
                : ""
            }`}
            id="connected-power"
            name="connected_power_kw"
            required
            onChange={(e) =>
              handleFieldChange("connected_power_kw", e.target.value)
            }
          />
          <div id="connected-power-help" className="form-text">
            кВт*
          </div>
          {touched.connected_power_kw && errors.connected_power_kw && (
            <div className="invalid-feedback">{errors.connected_power_kw}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="microgeneration" className="form-label">
            Микрогенерация <span className="text-danger">*</span>
          </label>
          <select
            className={`form-select ${
              touched.microgeneration && errors.microgeneration
                ? "is-invalid"
                : ""
            }`}
            id="microgeneration"
            name="microgeneration"
            required
            onChange={(e) =>
              handleFieldChange("microgeneration", e.target.value)
            }
          >
            <option value="">Выберите вариант</option>
            <option value="yes">Да</option>
            <option value="no">Нет</option>
          </select>
          {touched.microgeneration && errors.microgeneration && (
            <div className="invalid-feedback">{errors.microgeneration}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="monthly-consumption" className="form-label">
            Месячное потребление <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            step="0.1"
            className={`form-control ${
              touched.monthly_consumption_kwh && errors.monthly_consumption_kwh
                ? "is-invalid"
                : ""
            }`}
            id="monthly-consumption"
            name="monthly_consumption_kwh"
            required
            onChange={(e) =>
              handleFieldChange("monthly_consumption_kwh", e.target.value)
            }
          />
          <div id="monthly-consumption-help" className="form-text">
            кВт⋅ч*
          </div>
          {touched.monthly_consumption_kwh &&
            errors.monthly_consumption_kwh && (
              <div className="invalid-feedback">
                {errors.monthly_consumption_kwh}
              </div>
            )}
        </div>

        <div className="mb-3">
          <label htmlFor="price-kwh" className="form-label">
            Стоимость кВт⋅ч <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            step="0.1"
            className={`form-control ${
              touched.price_kwh && errors.price_kwh ? "is-invalid" : ""
            }`}
            id="price-kwh"
            name="price_kwh"
            required
            onChange={(e) => handleFieldChange("price_kwh", e.target.value)}
          />
          <div id="price-kwh-help" className="form-text">
            руб./кВт⋅ч*
          </div>
          {touched.price_kwh && errors.price_kwh && (
            <div className="invalid-feedback">{errors.price_kwh}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="building-height" className="form-label">
            Высота здания
          </label>
          <input
            type="text"
            className="form-control"
            id="building-height"
            name="building_height"
          />
          <div id="building-height-help" className="form-text">
            м*
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="transport-costs" className="form-label">
            Транспортные расходы
          </label>
          <select
            className="form-select"
            id="transport-costs"
            name="transport_costs"
          >
            <option value="yes">Да</option>
            <option value="no">Нет</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="dg-unit" className="form-label">
            ДГУ
          </label>
          <select className="form-select" id="dg-unit" name="dg_unit">
            <option value="yes">Да</option>
            <option value="no">Нет</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="electric-car" className="form-label">
            Электромобиль
          </label>
          <select className="form-select" id="electric-car" name="electric_car">
            <option value="yes">Да</option>
            <option value="no">Нет</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="project-number" className="form-label">
            Номер проекта
          </label>
          <input
            type="text"
            className="form-control"
            id="project-number"
            name="project_number"
          />
          <div id="project-number-help" className="form-text">
            из CRM
          </div>
        </div>

        <MultiSelect />

        <div className="mb-3 mt-4 btn-wrapper d-flex gap-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Сохранение...
              </>
            ) : (
              "Собрать данные"
            )}
          </button>
        </div>

        {submitError && (
          <div className="alert alert-danger" role="alert">
            {submitError}
          </div>
        )}

        {Object.keys(errors).length > 0 && (
          <div className="alert alert-danger" role="alert">
            <strong>Ошибки валидации:</strong>
            <ul className="mb-0 mt-2">
              {Object.values(errors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </>
  );
}
