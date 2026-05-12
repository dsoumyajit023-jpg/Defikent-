/**
 * prompt.js — builds the AI prompt string.
 */

export function buildPrompt({ bikes, location, kmDay, salary, prefList, customPref }) {
  const salaryFormatted = Number(salary).toLocaleString('en-IN');

  return `You are a professional Indian motorcycle comparison expert. Compare these bikes: ${bikes.join(' vs ')}.

User details:
- Location: ${location}
- Daily riding: ${kmDay} km/day
- Monthly salary: ₹${salaryFormatted}
- Preferences: ${prefList}
- Custom note: ${customPref || 'none'}

Return ONLY a valid JSON object (no markdown fences, no text outside the JSON) with exactly this structure:
{
  "bikes": [
    {
      "name": "Full Bike Name",
      "specs": {
        "engine": "...",
        "power": "...",
        "torque": "...",
        "mileage": "...",
        "fuel_tank": "...",
        "tyre_front": "...",
        "tyre_rear": "...",
        "weight": "...",
        "seat_height": "...",
        "ground_clearance": "...",
        "price_ex": "...",
        "launch_date": "Month YYYY (e.g. January 2019)"
      },
      "score": 78,
      "emi": "₹X,XXX/month (3yr)",
      "fuel_cost_month": "₹X,XXX",
      "service_cost_year": "₹X,XXX",
      "insurance_year": "₹X,XXX",
      "total_monthly_cost": "₹X,XXX",
      "salary_needed": "₹XX,XXX/month recommended",
      "parts_availability": "Excellent/Good/Average",
      "city_traffic_score": "X/10",
      "resale_value": "Good/Average/Poor",
      "key_strength": "one-line unique strength of this bike",
      "key_weakness": "one-line main weakness"
    }
  ],
  "winner_index": 0,
  "winner_reason": "short reason in 1 line",
  "differences": [
    {"spec": "Mileage", "verdict": "which bike wins and by how much"},
    {"spec": "Price", "verdict": "which bike wins and by how much"},
    {"spec": "Power", "verdict": "which bike wins and by how much"},
    {"spec": "Comfort", "verdict": "which bike wins and why"},
    {"spec": "Maintenance Cost", "verdict": "which bike wins and why"}
  ],
  "yes_no": [
    {"question": "Better for ${location} city traffic?", "yes_index": 0},
    {"question": "Superior fuel efficiency on ${kmDay}km/day?", "yes_index": 0},
    {"question": "Easier to maintain at local workshops?", "yes_index": 0},
    {"question": "More comfortable for long highway rides?", "yes_index": 0},
    {"question": "Safer braking system overall?", "yes_index": 0},
    {"question": "Better resale value after 3 years?", "yes_index": 0}
  ],
  "verdict": "2-3 sentence smart conclusion. Mention specific use cases. Be direct and helpful."
}`;
}

export function buildSuggestPrompt({ budget, prefList, location, customPref }) {
  const budgetFormatted = Number(budget).toLocaleString('en-IN');
  return `You are a professional Indian motorcycle advisor. Suggest exactly 2 bikes within a budget of ₹${budgetFormatted} for a rider in ${location || 'India'}.

Rider preferences: ${prefList || 'general riding'}
Custom note: ${customPref || 'none'}

Return ONLY a valid JSON object with exactly this structure (no markdown fences):
{
  "bikes": [
    {
      "name": "Full Bike Name",
      "specs": {
        "engine": "...",
        "power": "...",
        "torque": "...",
        "mileage": "...",
        "fuel_tank": "...",
        "tyre_front": "...",
        "tyre_rear": "...",
        "weight": "...",
        "seat_height": "...",
        "ground_clearance": "...",
        "price_ex": "...",
        "launch_date": "Month YYYY"
      },
      "score": 80,
      "emi": "₹X,XXX/month (3yr)",
      "fuel_cost_month": "₹X,XXX",
      "service_cost_year": "₹X,XXX",
      "insurance_year": "₹X,XXX",
      "total_monthly_cost": "₹X,XXX",
      "salary_needed": "₹XX,XXX/month recommended",
      "parts_availability": "Excellent/Good/Average",
      "city_traffic_score": "X/10",
      "resale_value": "Good/Average/Poor",
      "key_strength": "...",
      "key_weakness": "..."
    }
  ],
  "winner_index": 0,
  "winner_reason": "short reason why this is the top pick",
  "differences": [
    {"spec": "Mileage", "verdict": "which bike wins and by how much"},
    {"spec": "Price", "verdict": "which bike wins and by how much"},
    {"spec": "Power", "verdict": "which bike wins and by how much"},
    {"spec": "Comfort", "verdict": "which bike wins and why"},
    {"spec": "Maintenance Cost", "verdict": "which bike wins and why"}
  ],
  "yes_no": [
    {"question": "Better value for ₹${budgetFormatted} budget?", "yes_index": 0},
    {"question": "Superior fuel efficiency?", "yes_index": 0},
    {"question": "Easier to maintain locally?", "yes_index": 0},
    {"question": "More comfortable for long rides?", "yes_index": 0},
    {"question": "Safer braking system?", "yes_index": 0},
    {"question": "Better resale value after 3 years?", "yes_index": 0}
  ],
  "verdict": "2-3 sentence recommendation explaining which to buy and why, with specific use cases."
}`;
}
