import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import user from "@medusajs/medusa/commands/user";
import { get } from "http";

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const NEW_PLACES_API_ENDPOINT = process.env.GOOGLE_MAPS_PLACES_API_ENDPOINT || 'https://places.googleapis.com/v1/places';


const fieldMask = ['id','displayName.text','formattedAddress','addressComponents','location','internationalPhoneNumber','rating','regularOpeningHours','googleMapsUri','userRatingCount'
    
].map(field => `${field}`).join(',');

type StepInput = {
  place_id: string;
};

export const getFloristDetailStep = createStep(
  "get-florist-detail-step",
  async (input: StepInput, { container }) => {
    

      if (!API_KEY) {
        console.error("[DEBUG] Errore: GOOGLE_MAPS_API_KEY non trovata.");
        throw new Error("La variabile d'ambiente GOOGLE_MAPS_API_KEY non è impostata.");
      }

      if (!input) {
         console.error("[DEBUG] Errore: place_id non fornito.");
        throw new Error("L'ID del luogo (Place ID) è obbligatorio per lo step.");
      }


      const url = `${NEW_PLACES_API_ENDPOINT}/${input.place_id}`;
      
 
        const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-FieldMask': fieldMask,
              'X-Goog-Api-Key': API_KEY
            },
        });


        if (!response.ok) {
          const errorDetails = await response.text();
         console.error(`[DEBUG] Dettagli errore API Google: ${errorDetails}`);
          throw new Error(`Errore dalla Google API (${response.status}).`);
        }

        const data = await response.json();
        console.log("[DEBUG] Dati JSON ricevuti da Google:", JSON.stringify(data, null, 2));

        const place = data;

       


       

       const getAddressComponent = (type: string) => {
         return place.addressComponents?.find((c: any) => c.types.includes(type))?.longText || '';
      };

      const floristData = {
        place_id: place.id,
        name: place.displayName?.text,
        // CORREZIONE: Il campo è 'formattedAddress' in camelCase
        
        address_descr: place.formattedAddress,
        raddressoute: getAddressComponent('route'),
        address_number: getAddressComponent('street_number'),
        city: getAddressComponent('locality'),
        county: getAddressComponent('administrative_area_level_2'),
        country: getAddressComponent('country'),
        zip_code: getAddressComponent('postal_code'),
        location: place.location,
        main_phone: place.internationalPhoneNumber,
        //website: place.websiteUri,
        rating: place.rating,
        userRatingCount: place.userRatingCount,
        google_maps_url: place.googleMapsUri,
        opening_hours: place.regularOpeningHours.weekdayDescriptions,
        
      };

    return new StepResponse(floristData);


  }
);

