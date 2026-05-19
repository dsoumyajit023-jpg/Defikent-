
export function buildPrompt({ bikes, location, kmDay, salary, prefList, customPref }) {
  const sal = Number(salary).toLocaleString('en-IN');
  return `You are a professional Indian motorcycle comparison expert. Compare: ${bikes.join(' vs ')}.

User:
- Location: ${location}
- Daily riding: ${kmDay} km/day
- Monthly salary: Rs ${sal}
- Preferences: ${prefList}
- Note: ${customPref || 'none'}

Return ONLY valid JSON, no markdown fences, no text outside JSON:
{
  "bikes": [
    {
      "name": "Full Bike Name",
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
    {"spec": "Mileage", "verdict": "which wins and by how much"},
    {"spec": "Price", "verdict": "which wins and by how much"},
    {"spec": "Power", "verdict": "which wins and by how much"},
    {"spec": "Comfort", "verdict": "which wins and why"},
    {"spec": "Maintenance", "verdict": "which wins and why"}
  ],
  "yes_no": [
    {"question": "Better for ${location} city traffic?", "yes_index": 0},
    {"question": "Superior fuel efficiency on ${kmDay}km/day?", "yes_index": 0},
    {"question": "Easier to maintain at local workshops?", "yes_index": 0},
    {"question": "More comfortable for long highway rides?", "yes_index": 0},
    {"question": "Safer braking system overall?", "yes_index": 0},
    {"question": "Better resale value after 3 years?", "yes_index": 0}
  ],
  "verdict": "2-3 sentence conclusion. Be direct and helpful."
}`;
}

export function buildSuggestPrompt({ budget, prefList, location, customPref }) {
  const bud = Number(budget).toLocaleString('en-IN');
  return `You are a professional Indian motorcycle advisor. Suggest exactly 2 bikes within Rs ${bud} for a rider in ${location || 'India'}.

Preferences: ${prefList || 'general riding'}
Note: ${customPref || 'none'}

Return ONLY valid JSON, no markdown fences, no text outside JSON:
{
  "bikes": [
    {
      "name": "Full Bike Name",
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
    {"spec": "Mileage", "verdict": "..."},
    {"spec": "Price", "verdict": "..."},
    {"spec": "Power", "verdict": "..."},
    {"spec": "Comfort", "verdict": "..."},
    {"spec": "Maintenance", "verdict": "..."}
  ],
  "yes_no": [
    {"question": "Better value for Rs ${bud} budget?", "yes_index": 0},
    {"question": "Superior fuel efficiency?", "yes_index": 0},
    {"question": "Easier to maintain locally?", "yes_index": 0},
    {"question": "More comfortable for long rides?", "yes_index": 0},
    {"question": "Safer braking system?", "yes_index": 0},
    {"question": "Better resale value after 3 years?", "yes_index": 0}
  ],
  "verdict": "2-3 sentence recommendation."
}`;
}
