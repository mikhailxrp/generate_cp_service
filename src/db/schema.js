import {
  mysqlTable,
  int,
  varchar,
  decimal,
  mysqlEnum,
  timestamp,
  text,
  json,
  double,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

// Table users
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 190 }).notNull().unique(),
  name: varchar("name", { length: 190 }).notNull(),
  surname: varchar("surname", { length: 190 }).notNull(),
  phone: varchar("phone", { length: 190 }).notNull(),
  telegram: varchar("telegram", { length: 190 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 190 }).notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: varchar("role", { length: 20 }).notNull().default("manager"),
  avatarUrl: varchar("avatar_url", { length: 500 }),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

/* ---------- PRICE CATEGORIES: категории цен ---------- */
export const priceCategories = mysqlTable(
  "price_categories",
  {
    id: int("id").autoincrement().primaryKey(),

    // системный код категории: 'panel', 'inverter', 'ess', ...
    code: varchar("code", { length: 50 }).notNull().unique(),

    // человекочитаемое название: "Солнечные модули", "Инверторы"
    title: varchar("title", { length: 255 }).notNull(),

    // группировка по роли: 'core' | 'bos' | 'accessory' | 'other'
    groupCode: varchar("group_code", { length: 50 }).notNull().default("other"),

    description: text("description"),

    isActive: int("is_active").notNull().default(1),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    idxCode: sql`INDEX idx_price_categories_code (${table.code})`,
    idxGroup: sql`INDEX idx_price_categories_group (${table.groupCode})`,
  })
);

/* ---------- Единая таблица для 4 листов: MODULES/INVERTERS/ESS/MOUNT ---------- */
export const priceItems = mysqlTable(
  "price_items",
  {
    id: int("id").autoincrement().primaryKey(),
    typeCode: varchar("type_code", { length: 50 }).notNull(), // 'panel' | 'inverter' | 'ess' | 'mount'
    categoryId: int("category_id").notNull(), // FK на price_categories.id
    sku: varchar("sku", { length: 100 }).notNull().unique(),
    title: varchar("title", { length: 255 }).notNull(),

    // общие коммерческие поля
    priceRub: decimal("price_rub", { precision: 12, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 10 }).notNull().default("RUB"),
    stock: int("stock"), // "Наличие" -> число (если текст - парсим в импорте)
    priority: int("priority").default(0),
    warehouseRegion: varchar("warehouse_region", { length: 50 }),
    leadDays: int("lead_days"),
    specUrl: varchar("spec_url", { length: 500 }),
    comment: text("comment"),

    // гибкие атрибуты из листов (все остальные колонки)
    attrs: json("attrs"), // объект с произвольными полями

    isActive: int("is_active").notNull().default(1),
    priceUpdatedAt: timestamp("price_updated_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    idxType: sql`INDEX idx_type_code (${table.typeCode})`,
    idxPriority: sql`INDEX idx_priority (${table.priority})`,
    idxCategory: sql`INDEX idx_price_items_category_id (${table.categoryId})`,
  })
);

/* ---------- PRESETS: пресеты/шаблоны комплектов ---------- */
export const presets = mysqlTable("presets", {
  id: int("id").autoincrement().primaryKey(),
  useCase: varchar("use_case", { length: 100 }).notNull(), // из листа PRESETS.use_case
  rangeKwp: varchar("range_kwp", { length: 50 }), // строка типа "5-10"
  // список SKU модулей может быть несколько -> сохраним в JSON-массиве
  pvModuleSkus: json("pv_module_skus"), // ["SKU1","SKU2",...]
  inverterSku: varchar("inverter_sku", { length: 100 }),
  essSku: varchar("ess_sku", { length: 100 }),
  pcsSku: varchar("pcs_sku", { length: 100 }),
  mountSku: varchar("mount_sku", { length: 100 }),
  notes: text("notes"),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

/* ---------- COMPAT: совместимость инвертор <-> ESS ---------- */
export const compat = mysqlTable(
  "compat",
  {
    id: int("id").autoincrement().primaryKey(),
    inverterSku: varchar("inverter_sku", { length: 100 }).notNull(),
    essSku: varchar("ess_sku", { length: 100 }).notNull(),
    isCompatible: int("is_compatible").notNull().default(1), // 1 = совместим, 0 = нет
    limits: text("limits"), // ограничения
    comment: text("comment"),
  },
  (table) => ({
    uniqPair: sql`UNIQUE KEY uniq_inverter_ess (${table.inverterSku}, ${table.essSku})`,
  })
);

/* ---------- MAIN_INFORMATION: основная информация ---------- */
export const mainInformation = mysqlTable("main_information", {
  id: int("id").autoincrement().primaryKey(),
  clientName: varchar("client_name", { length: 255 }).notNull(),
  clientAddress: varchar("client_address", { length: 255 }).notNull(),
  clientType: varchar("client_type", { length: 255 }).notNull(),
  clientClass: varchar("client_class", { length: 255 }).notNull(),
  systemType: varchar("system_type", { length: 255 }).notNull(),
  typeArea: varchar("type_area", { length: 255 }).notNull().default(""),
  directionsCount: int("directions_count").notNull().default(1),
  sesPower: decimal("ses_power", { precision: 12, scale: 2 }).notNull(),
  combinedData: json("combined_data"),
  totalAnnualGeneration: decimal("total_annual_generation", {
    precision: 12,
    scale: 3,
  }),

  // Fields from InformationForm.jsx
  essBattery: varchar("ess_battery", { length: 100 }),
  networkPhazes: varchar("network_phazes", { length: 10 }),
  connectedPowerKw: int("connected_power_kw"),
  microgeneration: varchar("microgeneration", { length: 10 }),
  monthlyConsumptionKwh: int("monthly_consumption_kwh"),
  priceKwh: decimal("price_kwh", { precision: 10, scale: 1 }),
  buildingHeight: varchar("building_height", { length: 50 }),
  transportCosts: varchar("transport_costs", { length: 10 }),
  dgUnit: varchar("dg_unit", { length: 10 }),
  electricCar: varchar("electric_car", { length: 10 }),
  projectNumber: varchar("project_number", { length: 100 }),
  clientPains: json("client_pains"),
  clientPainsLabels: json("client_pains_labels"),

  // Данные таблиц из CreateSesButton
  bomData: json("bom_data"), // данные таблицы "Оборудование" (Bill of Materials)
  servicesData: json("services_data"), // данные таблицы "Услуги"

  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  step: int("step").notNull().default(1),
});

// SERVICES: платные работы/услуги (монтаж, ПНР, сервис и т.п.)
export const services = mysqlTable(
  "services",
  {
    id: int("id").autoincrement().primaryKey(),

    // из XLSX
    sku: varchar("sku", { length: 100 }).notNull().unique(),
    title: varchar("title", { length: 255 }).notNull(),
    category: varchar("category", { length: 50 }).notNull().default("service"),
    serviceType: varchar("service_type", { length: 100 }).notNull(),
    description: text("description"),

    basePrice: decimal("base_price", { precision: 12, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 10 }).notNull().default("RUB"),

    executionDays: int("execution_days"),
    warrantyYears: int("warranty_years"),
    comment: text("comment"),

    // служебные поля по аналогии с price_items
    isActive: int("is_active").notNull().default(1),
    priority: int("priority").notNull().default(0),
    priceUpdatedAt: timestamp("price_updated_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    idxType: sql`INDEX idx_service_type (${table.serviceType})`,
    idxPriority: sql`INDEX idx_priority (${table.priority})`,
  })
);
