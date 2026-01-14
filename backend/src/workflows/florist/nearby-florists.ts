import { 
  createWorkflow, 
  WorkflowData, 
  WorkflowResponse, 
  transform
} from "@medusajs/framework/workflows-sdk";
import { nearbyFloristsStep } from "./steps/nearby-florists";


export type Coordinates = {
  lat: number;
  lng: number;
}



export const nearbyFloristsWorkflow = createWorkflow(
  "nearby-florists",
  (input: Coordinates) => {
    const floristsList = nearbyFloristsStep(input);

    const finalResponse = transform(floristsList, (florists) => {
      if (!florists || florists.length === 0) {
        return {
          message: 'Nessun fioraio trovato in zona.',
          distance: 'N/A',
          color: 'red',
          //florists: []
        };
      }

      const closestFlorist = florists[0];
      const distanceKm = closestFlorist.distanceKm;

      let color: 'green' | 'yellow' | 'red';
      let message: string;

      if (distanceKm <= 2) {
        color = 'green';
        message = `Fioraio a ${distanceKm.toFixed(1)} km. Consegna ultra-rapida!`;
      } else if (distanceKm > 2 && distanceKm <= 10) {
        color = 'yellow';
        message = `Fioraio a ${distanceKm.toFixed(1)} km. Consegna standard.`;
      } else {
        color = 'red';
        message = `Fioraio a ${distanceKm.toFixed(1)} km. Consegna con possibili ritardi.`;
      }

      return {
        message,
        distance: distanceKm.toFixed(1),
        color,
        //florists: florists,
      };
    });
  
    
    return new WorkflowResponse(finalResponse);
    
  }
)