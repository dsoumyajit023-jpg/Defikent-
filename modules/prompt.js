/**
 * prompt.js
 * Builds the Groq prompt string from user inputs.
 * Isolated here so it can be unit-tested independently.
 */

/**
 * @param {object} params
 * @param {string[]} params.bikes  - bike model names
 * @param {string}   params.location
 * @param {string}   params.kmDay
 * @param {string}   params.salary  - raw number string
 * @param {string}   params.prefList
 * @param {string}   params.customPref
 * @returns {string}
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
        "price_ex": "..."
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
      "resale_value": "Good/Average/Poor"
    }
  ],
  "winner_index": 0,
  "winner_reason": "short reason in 1 line",
  "yes_no": [
    {"question": "Best for ${location} traffic?", "yes_index": 0},
    {"question": "Better mileage?", "yes_index": 0},
    {"question": "Affordable on ₹${salaryFormatted} salary?", "yes_index": 0},
    {"question": "Good for daily ${kmDay}km rides?", "yes_index": 0}
  ],
  "verdict": "2-3 sentence smart conclusion. Mention specific use cases. Be direct and helpful."
}`;
}
