export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Calcola la distanza tra due coordinate geografiche utilizzando la formula di Haversine.
 * @param coord1 Coordinate di partenza
 * @param coord2 Coordinate di arrivo
 * @returns Distanza in chilometri (km)
 */
export function haversineDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Raggio della Terra in chilometri

  const lat1Rad = toRad(coord1.lat);
  const lat2Rad = toRad(coord2.lat);
  const deltaLat = toRad(coord2.lat - coord1.lat);
  const deltaLng = toRad(coord2.lng - coord1.lng);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) *
    Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distanza in km
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}