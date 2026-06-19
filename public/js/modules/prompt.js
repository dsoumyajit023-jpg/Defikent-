

export function buildPrompt({ bikes, location, kmDay, salary, prefList, customPref }) {
  const sal = Number(salary).toLocaleString('en-IN');
  return `You are a professional Indian vehicle comparison expert. You can compare any type of vehicle — motorcycles, scooters, hatchbacks, sedans, SUVs, electric vehicles, or any mix. Compare: ${bikes.join(' vs ')}.

User:
- Location: ${location}
- Daily usage: ${kmDay} km/day
- Monthly salary: Rs ${sal}
- Preferences: ${prefList}
- Note: ${customPref || 'none'}

Detect the vehicle type automatically. For cars, adapt specs (e.g. mileage in km/l or kmpl, fuel_tank in litres, weight in kg, seat_height can be "N/A" for cars, ground_clearance in mm). For EVs, mileage = range in km, fuel_tank = battery in kWh.

Return ONLY valid JSON, no markdown fences, no text outside JSON:
{
  "bikes": [
    {
      "name": "Full Vehicle Name",
      "specs": {
        "engine": "...", "power": "...", "torque": "...", "mileage": "...",
        "fuel_tank": "...", "tyre_front": "...", "tyre_rear": "...",
        "weight": "...", "seat_height": "...", "ground_clearance": "...",
        "price_ex": "...", "launch_date": "Month YYYY"
      },
      "score": 78,
      "emi": "Rs X,XXX/month (3yr)",
      "fuel_cost_month": "Rs X,XXX",
      "service_cost_year": "Rs X,XXX",
      "insurance_year": "Rs X,XXX",
      "total_monthly_cost": "Rs X,XXX",
      "salary_needed": "Rs XX,XXX/month recommended",
      "parts_availability": "Excellent/Good/Average",
      "city_traffic_score": "X/10",
      "resale_value": "Good/Average/Poor",
      "key_strength": "one-line strength",
      "key_weakness": "one-line weakness"
    }
  ],
  "winner_index": 0,
  "winner_reason": "one line reason",
  "differences": [
    {"spec": "Mileage / Range", "verdict": "which wins and by how much"},
    {"spec": "Price", "verdict": "which wins and by how much"},
    {"spec": "Power", "verdict": "which wins and by how much"},
    {"spec": "Comfort", "verdict": "which wins and why"},
    {"spec": "Maintenance", "verdict": "which wins and why"}
  ],
  "yes_no": [
    {"question": "Better for ${location} city traffic?", "yes_index": 0},
    {"question": "Superior fuel efficiency on ${kmDay}km/day?", "yes_index": 0},
    {"question": "Easier to maintain at local service centres?", "yes_index": 0},
    {"question": "More comfortable for long highway journeys?", "yes_index": 0},
    {"question": "Safer braking system overall?", "yes_index": 0},
    {"question": "Better resale value after 3 years?", "yes_index": 0}
  ],
  "verdict": "2-3 sentence conclusion. Be direct and helpful."
}`;
}

export function buildSuggestPrompt({ budget, prefList, location, customPref }) {
  const bud = Number(budget).toLocaleString('en-IN');
  return `You are a professional Indian vehicle advisor. You can suggest any type of vehicle — motorcycle, scooter, hatchback, sedan, SUV, or EV. Suggest exactly 2 vehicles within Rs ${bud} for a buyer in ${location || 'India'}.

Preferences: ${prefList || 'general use'}
Note: ${customPref || 'none'}

Pick the most suitable vehicle types based on the preferences. Adapt specs for the vehicle type (cars: seat_height = "N/A"; EVs: mileage = range in km, fuel_tank = battery kWh).

Return ONLY valid JSON, no markdown fences, no text outside JSON:
{
  "bikes": [
    {
      "name": "Full Vehicle Name",
      "specs": {
        "engine": "...", "power": "...", "torque": "...", "mileage": "...",
        "fuel_tank": "...", "tyre_front": "...", "tyre_rear": "...",
        "weight": "...", "seat_height": "...", "ground_clearance": "...",
        "price_ex": "...", "launch_date": "Month YYYY"
      },
      "score": 80,
      "emi": "Rs X,XXX/month (3yr)",
      "fuel_cost_month": "Rs X,XXX",
      "service_cost_year": "Rs X,XXX",
      "insurance_year": "Rs X,XXX",
      "total_monthly_cost": "Rs X,XXX",
      "salary_needed": "Rs XX,XXX/month recommended",
      "parts_availability": "Excellent/Good/Average",
      "city_traffic_score": "X/10",
      "resale_value": "Good/Average/Poor",
      "key_strength": "...",
      "key_weakness": "..."
    }
  ],
  "winner_index": 0,
  "winner_reason": "one line",
  "differences": [
    {"spec": "Mileage / Range", "verdict": "..."},
    {"spec": "Price", "verdict": "..."},
    {"spec": "Power", "verdict": "..."},
    {"spec": "Comfort", "verdict": "..."},
    {"spec": "Maintenance", "verdict": "..."}
  ],
  "yes_no": [
    {"question": "Better value for Rs ${bud} budget?", "yes_index": 0},
    {"question": "Superior fuel efficiency / range?", "yes_index": 0},
    {"question": "Easier to maintain locally?", "yes_index": 0},
    {"question": "More comfortable for long journeys?", "yes_index": 0},
    {"question": "Safer braking system?", "yes_index": 0},
    {"question": "Better resale value after 3 years?", "yes_index": 0}
  ],
  "verdict": "2-3 sentence recommendation."
}`;
}

export function buildProfilePrompt({ bike, location }) {
  return `You are a professional Indian vehicle expert. Give a complete profile of: ${bike} for a buyer/rider in ${location || 'India'}.

Detect whether this is a motorcycle, scooter, car, EV, or other vehicle type and adapt specs accordingly (cars: seat_height = "N/A"; EVs: mileage = range in km, fuel_tank = battery kWh).

Return ONLY valid JSON, no markdown fences, no text outside JSON:
{
  "bikes": [
    {
      "name": "Full Vehicle Name",
      "specs": {
        "engine": "...", "power": "...", "torque": "...", "mileage": "...",
        "fuel_tank": "...", "tyre_front": "...", "tyre_rear": "...",
        "weight": "...", "seat_height": "...", "ground_clearance": "...",
        "price_ex": "...", "launch_date": "Month YYYY"
      },
      "score": 80,
      "emi": "Rs X,XXX/month (3yr)",
      "fuel_cost_month": "Rs X,XXX",
      "service_cost_year": "Rs X,XXX",
      "insurance_year": "Rs X,XXX",
      "total_monthly_cost": "Rs X,XXX",
      "salary_needed": "Rs XX,XXX/month recommended",
      "parts_availability": "Excellent/Good/Average",
      "city_traffic_score": "X/10",
      "resale_value": "Good/Average/Poor",
      "key_strength": "one-line strength",
      "key_weakness": "one-line weakness"
    }
  ],
  "winner_index": 0,
  "winner_reason": "one line summary of this vehicle",
  "differences": [
    {"spec": "Best For", "verdict": "..."},
    {"spec": "Avoid If", "verdict": "..."},
    {"spec": "Rivals", "verdict": "..."},
    {"spec": "Value", "verdict": "..."},
    {"spec": "Verdict", "verdict": "..."}
  ],
  "yes_no": [
    {"question": "Good for daily city commute?", "yes_index": 0},
    {"question": "Suitable for long highway journeys?", "yes_index": 0},
    {"question": "Easy to maintain locally?", "yes_index": 0},
    {"question": "Good resale value after 3 years?", "yes_index": 0},
    {"question": "Worth the price in ${location || 'India'}?", "yes_index": 0}
  ],
  "verdict": "2-3 sentence honest review of this vehicle."
}`;
}
