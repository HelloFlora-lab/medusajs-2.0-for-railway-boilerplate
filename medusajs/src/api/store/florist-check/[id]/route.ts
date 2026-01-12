import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { z } from "zod";
import { getFloristDetailWorkflow } from "../../../../workflows/florist/get-florist-detail";



export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {

  
  const placeId = req.params.id;

  if (!placeId) {
    console.error("[DEBUG] Errore: Place ID mancante nei parametri della richiesta.");
    return res.status(400).json({ message: "L'ID del luogo (Place ID) è obbligatorio." });
  }

  try {
    

    const workflowInput = {
      place_id: placeId,
    };
    
    const { result } = await getFloristDetailWorkflow.run({
      input: workflowInput,
    });
      

    console.log("[DEBUG] Risultato ricevuto dal workflow:", JSON.stringify(result, null, 2));

    res.json({
     
      florist: result,
    });

  } catch (error) {
    console.error("--- [DEBUG] Errore durante l'esecuzione del workflow get-florist-details:", error);
    res.status(500).json({
      message: "Errore interno del server durante il recupero dei dettagli del fiorista.",
      error: error.message,
    });
  }
};