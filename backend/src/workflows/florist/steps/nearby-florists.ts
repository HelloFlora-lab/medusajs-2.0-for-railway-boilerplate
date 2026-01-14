import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { haversineDistance } from "../../../utils/distance";

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const NEW_PLACES_API_ENDPOINT = process.env.GOOGLE_MAPS_PLACES_API_ENDPOINT || 'https://places.googleapis.com/v1/places:searchText';

const fieldMask = [
    'id', 'name', 'displayName', 'formattedAddress', 'location'
].map(field => `places.${field}`).join(',');

export type Coordinates = {
  lat: number;
  lng: number;
}

export const nearbyFloristsStep = createStep(
  "nearby-florists-step",
  async (input: Coordinates, { container }) => {
    if (!API_KEY) {
      throw new Error("La variabile d'ambiente GOOGLE_MAPS_API_KEY non è impostata.");
    }

    const { lat, lng } = input;

    const requestBody = {
      textQuery: "fioraio",
      locationBias: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: 15000,
        },
      },
      rankPreference: "DISTANCE",
    };

    const response = await fetch(`${NEW_PLACES_API_ENDPOINT}:searchText`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': fieldMask,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error(`Google API Error Status: ${response.status}`, errorDetails);
      throw new Error(`Errore dalla Google API (${response.status}).`);
    }

    const data = await response.json();
    const results = data.places || [];

    if (results.length === 0) {
      return new StepResponse([]); // Restituisce un array vuoto se non ci sono risultati
    }

    const floristsList = results.map((place: any) => {
      const floristCoords: Coordinates = {
        lat: place.location.latitude,
        lng: place.location.longitude,
      };
      const distanceKm = haversineDistance(input, floristCoords);

      return {
        id: place.id,
        name: place.displayName?.text || place.name,
        address: place.formattedAddress || 'Indirizzo non disponibile',
        distanceKm: distanceKm,
        location: floristCoords,
      };
    }).sort((a: any, b: any) => a.distanceKm - b.distanceKm);

    return new StepResponse(floristsList);
  }
);