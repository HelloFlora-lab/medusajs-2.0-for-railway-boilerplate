import { 
  createWorkflow,
  WorkflowResponse,
  WorkflowData, // Importa WorkflowData per una migliore gestione dei tipi
  transform,    // Importa transform per eseguire log e controlli
} from "@medusajs/framework/workflows-sdk"
import { createReviewStep } from "./steps/create-review"
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

type CreateReviewInput = {
  title?: string
  content: string
  rating: number
  product_id: string
  customer_id?: string
  first_name: string
  last_name: string
  status?: "pending" | "approved" | "rejected"
}

export const createReviewWorkflow = createWorkflow(
  "create-review-workflow",
  (input: WorkflowData<CreateReviewInput>) => { // Usa WorkflowData<T> per il tipo di input
    
    // Log 1: Registra l'input iniziale ricevuto dal workflow
    transform(input, (data) => {
      console.log("[create-review-workflow] Workflow avviato con l'input:", data);
      
      // Controllo 1: Aggiungi una validazione di base all'interno del workflow
      if (!data.product_id || !data.content || !data.rating) {
        // Questo errore fermerà il workflow se i dati essenziali mancano
        throw new Error("ID Prodotto, contenuto e valutazione sono obbligatori per creare una recensione.");
      }
    });

    // Log 2: Registra l'ID del prodotto che sta per essere validato
    transform(input, (data) => {
      console.log(`[create-review-workflow] Validazione dell'esistenza del prodotto con ID: ${data.product_id}`);
    });

    // Check product exists
    useQueryGraphStep({
      entity: "product",
      fields: ["id"],
      filters: {
        id: input.product_id,
      },
      options: {
        throwIfKeyNotFound: true, // Questo è già un ottimo controllo, se il prodotto non esiste, il workflow fallirà qui
      },
    })

    // Log 3: Registra i dati che vengono passati allo step di creazione
    transform(input, (data) => {
      console.log("[create-review-workflow] Chiamata a createReviewStep con i dati:", data);
    });

    // Create the review
    const review = createReviewStep(input)

    // Log 4: Registra il risultato dello step di creazione prima di restituire la risposta
    transform({ review }, (data) => {
      console.log("[create-review-workflow] Recensione creata con successo:", data.review);
    });

    return new WorkflowResponse({
      review,
    })
  }
)