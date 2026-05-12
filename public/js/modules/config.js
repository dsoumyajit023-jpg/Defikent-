/**
 * config.js — central config. Change values here only.
 */

export const CONFIG = {
  GROQ_MODEL: 'llama3-70b-8192',
  GROQ_MAX_TOKENS: 2000,
  GROQ_TEMPERATURE: 0.3,
  API_ENDPOINT: '/api/compare',
  SPLASH_DELAY: 2800,
  SPLASH_FADE: 600,
  ERROR_DISMISS: 6000,
  KM_DEFAULT: 50,
  KM_MIN: 10,
  KM_MAX: 200,
  SALARY_DEFAULT: 40000,
  SALARY_MIN: 10000,
  SALARY_MAX: 200000,
  SALARY_STEP: 5000,
  BUDGET_MIN: 50000,
  BUDGET_MAX: 600000,
  BUDGET_STEP: 10000,
  BUDGET_DEFAULT: 150000,
};

export const SPEC_KEYS = {
  engine:           'Engine',
  power:            'Power',
  torque:           'Torque',
  mileage:          'Mileage',
  fuel_tank:        'Fuel Tank',
  tyre_front:       'Front Tyre',
  tyre_rear:        'Rear Tyre',
  weight:           'Weight',
  seat_height:      'Seat Height',
  ground_clearance: 'Ground Clearance',
  price_ex:         'Ex-showroom Price',
  launch_date:      'Launch Date',
};

export const SPEC_TOOLTIPS = {
  engine:           'Engine displacement in cc — larger usually means more power',
  power:            'Maximum horsepower (bhp/PS) — determines top speed potential',
  torque:           'Pulling force in Nm — higher torque = better acceleration',
  mileage:          'Fuel efficiency in km/l under typical Indian riding conditions',
  fuel_tank:        'Fuel tank capacity in litres — affects how far you can ride before refuelling',
  tyre_front:       'Front tyre width/profile — wider = more grip, narrower = lighter steering',
  tyre_rear:        'Rear tyre width/profile — affects traction and cornering',
  weight:           'Kerb weight in kg — lighter bikes are easier to handle in traffic',
  seat_height:      'Distance from ground to seat in mm — affects rider comfort and reach',
  ground_clearance: 'Minimum gap between road and chassis — higher = better for rough roads',
  price_ex:         'Ex-showroom price — on-road price will be higher after taxes & insurance',
  launch_date:      'Month and year this model was officially launched in India',
};

export const META_KEYS = [
  ['parts_availability', 'Parts Availability'],
  ['city_traffic_score', 'City Traffic Score'],
  ['resale_value',       'Resale Value'],
];

export const META_TOOLTIPS = {
  parts_availability: 'How easily spare parts are found at local mechanics across India',
  city_traffic_score: 'How well the bike handles stop-and-go city traffic (out of 10)',
  resale_value:       'Expected resale value after 3 years compared to purchase price',
};

export const PREFERENCES = [
  { key: 'daily_commute',   label: 'Daily Commute' },
  { key: 'rapido_ola',      label: 'Rapido / OLA Delivery' },
  { key: 'long_tours',      label: 'Long Tours' },
  { key: 'highway',         label: 'Highway Riding' },
  { key: 'city_traffic',    label: 'Heavy City Traffic' },
  { key: 'fuel_economy',    label: 'Best Mileage' },
  { key: 'style',           label: 'Style & Look' },
  { key: 'low_maintenance', label: 'Low Maintenance' },
  { key: 'resale',          label: 'Good Resale Value' },
  { key: 'performance',     label: 'Performance & Speed' },
];

export const YES_NO_QUESTIONS = [
  'Better for city traffic handling?',
  'Superior fuel efficiency?',
  'Easier to maintain locally?',
  'More comfortable for long rides?',
  'Better resale value after 3 years?',
  'Safer braking system?',
];
