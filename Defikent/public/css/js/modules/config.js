/**
 * config.js
 * Central configuration — change values here, nowhere else.
 */

export const CONFIG = {
  // Groq model to use (server-side via /api/compare)
  GROQ_MODEL: 'llama3-70b-8192',
  GROQ_MAX_TOKENS: 2000,
  GROQ_TEMPERATURE: 0.3,

  // API endpoint (our own Vercel serverless function — key never exposed to browser)
  API_ENDPOINT: '/api/compare',

  // Splash screen dismiss delay (ms)
  SPLASH_DELAY: 2400,
  SPLASH_FADE: 700,

  // Error auto-dismiss (ms)
  ERROR_DISMISS: 5000,

  // Slider defaults
  KM_DEFAULT: 50,
  KM_MIN: 10,
  KM_MAX: 200,
  SALARY_DEFAULT: 40000,
  SALARY_MIN: 10000,
  SALARY_MAX: 200000,
  SALARY_STEP: 5000,
};

export const SPEC_KEYS = {
  engine: 'Engine',
  power: 'Power',
  torque: 'Torque',
  mileage: 'Mileage',
  fuel_tank: 'Fuel Tank',
  tyre_front: 'Front Tyre',
  tyre_rear: 'Rear Tyre',
  weight: 'Weight',
  seat_height: 'Seat Height',
  ground_clearance: 'Ground Clearance',
  price_ex: 'Ex-showroom Price',
};

export const META_KEYS = [
  ['parts_availability', '🔧 Parts Available'],
  ['city_traffic_score', '🚦 City Traffic'],
  ['resale_value', '💰 Resale Value'],
];

export const PREFERENCES = [
  { key: 'daily_commute',   label: '🏙️ Daily Commute' },
  { key: 'rapido_ola',      label: '🛵 Rapido / OLA' },
  { key: 'long_tours',      label: '🏔️ Long Tours' },
  { key: 'highway',         label: '🛣️ Highway Riding' },
  { key: 'city_traffic',    label: '🚦 Heavy City Traffic' },
  { key: 'fuel_economy',    label: '⛽ Best Mileage' },
  { key: 'style',           label: '✨ Style & Look' },
  { key: 'low_maintenance', label: '🔧 Low Maintenance' },
  { key: 'resale',          label: '💰 Good Resale Value' },
  { key: 'performance',     label: '🔥 Performance & Speed' },
];
