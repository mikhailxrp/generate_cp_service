-- Добавление поля payback_data в таблицу main_information
-- Дата: 2025-12-12
-- Описание: Поле для хранения результатов расчета окупаемости СЭС

ALTER TABLE main_information 
ADD COLUMN payback_data JSON AFTER services_data;

