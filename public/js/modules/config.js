
/**
 * config.js — single source of truth for all constants.
 */
export const CONFIG = {
  API_ENDPOINT:    '/api/compare',
  SPLASH_DELAY:    2000,   // ms before splash fades
  SPLASH_FADE:     600,
  ERROR_DISMISS:   6000,
  KM_DEFAULT:  50,  KM_MIN: 10,  KM_MAX: 200,
  SALARY_DEFAULT: 40000, SALARY_MIN: 10000, SALARY_MAX: 200000, SALARY_STEP: 5000,
  BUDGET_DEFAULT: 150000, BUDGET_MIN: 50000, BUDGET_MAX: 600000, BUDGET_STEP: 10000,
};

export const SPEC_KEYS = {
  engine:           'Engine',
  power:            'Power',
  torque:           'Torque',
  mileage:          'Mileage / Range',
  fuel_tank:        'Fuel Tank / Battery',
  tyre_front:       'Front Tyre',
  tyre_rear:        'Rear Tyre',
  weight:           'Weight',
  seat_height:      'Seat Height',
  ground_clearance: 'Ground Clearance',
  price_ex:         'Ex-showroom Price',
  launch_date:      'Launch Date',
};

export const SPEC_TOOLTIPS = {
  engine:           'Engine displacement in cc (or motor power in kW for EVs) — larger usually means more power',
  power:            'Max horsepower (bhp/PS) — determines top speed potential',
  torque:           'Pulling force in Nm — higher = better acceleration from standstill',
  mileage:          'Fuel efficiency in km/l or range in km (for EVs) under typical Indian conditions',
  fuel_tank:        'Tank capacity in litres or battery capacity in kWh — affects range before next refuel/charge',
  tyre_front:       'Front tyre size — wider tyres give more grip but heavier steering',
  tyre_rear:        'Rear tyre size — affects traction and cornering stability',
  weight:           'Kerb weight in kg — lighter vehicles are easier in city traffic',
  seat_height:      'Seat height in mm — affects rider/driver comfort and reach',
  ground_clearance: 'Clearance between road and chassis — higher = better on rough roads',
  price_ex:         'Ex-showroom price — on-road will be higher after taxes and insurance',
  launch_date:      'Month and year this model was launched in India',
};

export const META_KEYS = [
  ['parts_availability', 'Parts Availability'],
  ['city_traffic_score', 'City Traffic Score'],
  ['resale_value',       'Resale Value'],
];

export const META_TOOLTIPS = {
  parts_availability: 'How easily spare parts are available at local service centres across India',
  city_traffic_score: 'How well the vehicle handles stop-and-go city traffic, rated out of 10',
  resale_value:       'Expected resale value after 3 years relative to purchase price',
};

export const PREFERENCES = [
  { key: 'daily_commute',   label: 'Daily Commute' },
  { key: 'delivery_use',    label: 'Delivery / Gig Use' },
  { key: 'long_tours',      label: 'Long Tours / Road Trips' },
  { key: 'highway',         label: 'Highway Driving' },
  { key: 'city_traffic',    label: 'Heavy City Traffic' },
  { key: 'fuel_economy',    label: 'Best Mileage / Range' },
  { key: 'style',           label: 'Style and Look' },
  { key: 'low_maintenance', label: 'Low Maintenance' },
  { key: 'resale',          label: 'Good Resale Value' },
  { key: 'performance',     label: 'Performance and Speed' },
  { key: 'family_use',      label: 'Family Use' },
  { key: 'ev_preferred',    label: 'Electric Vehicle' },
];
