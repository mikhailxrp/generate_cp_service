"use client";
import "./preview-components.css";
import { useState, useEffect } from "react";

export default function CpBlockOne({
  clientName,
  clientType,
  sesPower,
  systemType,
  engineerName,
  clientAddress,
  clientLogoUrl,
}) {
  const [displayAddress, setDisplayAddress] = useState("");

  useEffect(() => {
    async function processAddress() {
      if (!clientAddress) {
        setDisplayAddress("");
        return;
      }

      // Проверяем, является ли адрес координатами (формат: "lat,lng" или объект)
      const isCoordinates = (addr) => {
        if (typeof addr === "string") {
          const parts = addr.split(",").map((p) => p.trim());
          if (parts.length === 2) {
            const lat = parseFloat(parts[0]);
            const lng = parseFloat(parts[1]);
            return (
              !isNaN(lat) &&
              !isNaN(lng) &&
              Math.abs(lat) <= 90 &&
              Math.abs(lng) <= 180
            );
          }
        }
        return false;
      };

      if (isCoordinates(clientAddress)) {
        // Это координаты - получаем адрес через OpenStreetMap
        try {
          const [lat, lng] = clientAddress.split(",").map((p) => p.trim());
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ru`
          );

          if (response.ok) {
            const data = await response.json();
            setDisplayAddress(data.display_name || clientAddress);
          } else {
            setDisplayAddress(clientAddress);
          }
        } catch (error) {
          console.error("Ошибка геокодирования:", error);
          setDisplayAddress(clientAddress);
        }
      } else {
        // Это уже строка адреса
        setDisplayAddress(clientAddress);
      }
    }

    processAddress();
  }, [clientAddress]);

  return (
    <div className="cp-block cp-block-one">
      <div className="cp-block-one-wrapper">
        {/* Шапка с заголовком и логотипом */}
        <div className="cp-block-one-wrapper__header">
          <div className="cp-block-one-wrapper__title">
            <div className="cp-block-one-wrapper__title-line-1">
              ЦИФРОВОЙ АУДИТ
            </div>
            <div className="cp-block-one-wrapper__title-line-2">
              ЭНЕРГОЭФФЕКТИВНОСТИ
            </div>
          </div>
          <div className="header-logos-wrapper">
            {clientLogoUrl && clientLogoUrl.trim() !== "" && (
              <>
                <div>
                  <img
                    src={clientLogoUrl}
                    alt="Логотип клиента"
                    className="cp-block-one-wrapper__client-logo"
                  />
                </div>
                <div className="header-logos-wrapper_divider"></div>
              </>
            )}
            <div>
              <img
                src="/brand/logo.svg"
                alt="Логотип"
                className="cp-block-one-wrapper__logo"
              />
            </div>
          </div>
        </div>

        {displayAddress && (
          <div className="cp-block-one-wrapper__address">{displayAddress}</div>
        )}

        {/* Подпись разработчика */}
        <div className="cp-block-one-wrapper__footer">
          Разработал инженер: {engineerName || ""}
        </div>
      </div>
    </div>
  );
}
