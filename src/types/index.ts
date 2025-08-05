
/**
 * Defines the structure for a single color-coding rule.
 * Each rule links a data condition (e.g., temperature > 25) to a specific color.
 */
export interface ColorRule {
  id: string;
  field: 'temperature_2m'; // The data field this rule applies to. Can be expanded later.
  operator: '>' | '<' | '=' | '>=' | '<='; // The comparison operator.
  value: number; // The value to compare against.
  color: string; // The hex color code to apply if the rule is met.
}

/**
 * Defines the complete data structure for a single drawn polygon.
 * This is the core data object for our application's main feature.
 */
export interface PolygonData {
  id: string; // A unique identifier for the polygon.
  points: [number, number][]; // An array of [latitude, longitude] pairs defining the polygon's shape.
  dataSource: 'open-meteo'; // The source of the data for this polygon.
  rules: ColorRule[]; // An array of color rules specific to this polygon.
  currentValue?: number; // The fetched and processed data value (e.g., 27.5).
  color: string; // The final color of the polygon, determined by applying the rules.
}