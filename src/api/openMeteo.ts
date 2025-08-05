
import axios from 'axios';
import { format, parseISO, isBefore, startOfDay, subDays, endOfDay } from 'date-fns';

const HISTORICAL_API_URL = 'https://archive-api.open-meteo.com/v1/archive';
const FORECAST_API_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * A helper function to make a single API call and process the response.
 * This function is now more robust in its error logging.
 */
async function makeApiCall(
  url: string,
  params: object,
  rangeStartISO: string,
  rangeEndISO: string
): Promise<number[] | null> {
  try {
    const response = await axios.get(url, { params });
    if (response.data && response.data.hourly && response.data.hourly.temperature_2m) {
      const allHours = response.data.hourly.time.map((t: string) => new Date(t).toISOString());
      const allTemps = response.data.hourly.temperature_2m;
      
      const startIndex = allHours.findIndex((h: string) => h >= rangeStartISO);
      const endIndex = allHours.findLastIndex((h: string) => h <= rangeEndISO);

      if (startIndex === -1 || endIndex === -1) return [];

      return allTemps.slice(startIndex, endIndex + 1);
    }
    return null;
  } catch (error: any) {
    const apiName = url.includes('archive') ? 'Archive' : 'Forecast';
    // Log the exact URL that failed for easier debugging in the future.
    console.error(`Failed to fetch from Open-Meteo API (${apiName}) at URL: ${error.config.url}`, error.message);
    return null;
  }
}

/**
 * Fetches temperature data for a given location and time range.
 * This version uses a clear, robust logic to handle all date range cases.
 */
export async function fetchTemperatureData(
  lat: number,
  lon: number,
  startDateISO: string,
  endDateISO: string
): Promise<number[] | null> {
  // Use start of the current day as a stable reference point for all comparisons.
  const todayStart = startOfDay(new Date());
  const startDate = parseISO(startDateISO);
  const endDate = parseISO(endDateISO);

  const baseParams = {
    latitude: lat.toFixed(4),
    longitude: lon.toFixed(4),
    hourly: 'temperature_2m',
  };

  // Case 1: The entire selected range is in the future (starts on or after today).
  if (!isBefore(startDate, todayStart)) {
    return makeApiCall(FORECAST_API_URL, {
      ...baseParams,
      start_date: format(startDate, 'yyyy-MM-dd'),
      end_date: format(endDate, 'yyyy-MM-dd'),
    }, startDateISO, endDateISO);
  }

  // Case 2: The entire selected range is in the past (ends before today).
  if (isBefore(endDate, todayStart)) {
    return makeApiCall(HISTORICAL_API_URL, {
      ...baseParams,
      start_date: format(startDate, 'yyyy-MM-dd'),
      end_date: format(endDate, 'yyyy-MM-dd'),
    }, startDateISO, endDateISO);
  }

  // Case 3: The range spans from the past into today/future. This is the complex case.
  // We must make two separate API calls and combine the results.
  const yesterdayEnd = endOfDay(subDays(todayStart, 1));

  // Promise for the historical part of the range (from start date up to yesterday).
  const historicalPromise = makeApiCall(HISTORICAL_API_URL, {
    ...baseParams,
    start_date: format(startDate, 'yyyy-MM-dd'),
    end_date: format(yesterdayEnd, 'yyyy-MM-dd'),
  }, startDateISO, yesterdayEnd.toISOString());

  // Promise for the forecast part of the range (from today up to the end date).
  const forecastPromise = makeApiCall(FORECAST_API_URL, {
    ...baseParams,
    start_date: format(todayStart, 'yyyy-MM-dd'),
    end_date: format(endDate, 'yyyy-MM-dd'),
  }, todayStart.toISOString(), endDateISO);

  // Wait for both API calls to complete.
  const [historicalData, forecastData] = await Promise.all([historicalPromise, forecastPromise]);

  // Combine the results from both calls.
  const combinedData = [...(historicalData || []), ...(forecastData || [])];
  
  return combinedData;
}