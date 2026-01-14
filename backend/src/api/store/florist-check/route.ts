import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Coordinates } from "../../../utils/distance";
import { nearbyFloristsWorkflow } from "../../../workflows/florist/nearby-florists";


export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { lat, lng } = req.body as Coordinates;
  
  if (!lat || !lng) {
    return res.status(400).json({ 
      error: 'Coordinate non fornite nel corpo della richiesta (lat, lng).' 
    });
  }

  const workflowInput = { lat, lng };

  try {
   if (!req.validatedBody) {
        throw new Error("req.validatedBody è undefined. Controllare la configurazione del middleware.");
      }

      const { result } = await nearbyFloristsWorkflow(req.scope).run({
          input: workflowInput,
        })
      // Restituisci il risultato del workflow
      return res.status(200).json(result);
  } catch (error) {
    console.error('Errore durante l\'esecuzione del workflow nearby-florists:', error);
    return res.status(500).json({ error: 'Errore interno del server.' });
  }
  
}
