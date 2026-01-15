import {
  createWorkflow,
  WorkflowResponse,
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk";
import { Modules } from "@medusajs/utils";

export const createPromotionStep = createStep(
  "create-promotion",
  // step runner
  async (_input: any, { container }: { container: any }) => {
    const promotionModuleService: any = container.resolve(Modules.PROMOTION);

    if (!promotionModuleService) {
      throw new Error("promotionModuleService non disponibile");
    }

    
      const generateUniqueCode = (length: number = 6): string => {
        return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
    };

    // Payload minimo — adattalo alla shape richiesta dalla tua implementazione di promotionModuleService
    const payload: any = {
      code: generateUniqueCode(6),
      // campi comuni: type e rules/conditions dipendono dall'implementazione
      type: "standard",
      status: "active",
      description: "Promozione creata tramite workflow Newsletter Signup",
      tax_included: true,
      
      // Esempio: se il servizio si aspetta application_method / rules, aggiungili qui
       application_method: { type: "fixed", value: 5, target_type: "order" , currency_code: "eur", allocation: "across" },
      // rules: [...],
    };

    let promotion: any;

    if (typeof promotionModuleService.createPromotions === "function") {
      // createPromotions potrebbe restituire l'oggetto o un array; gestiamo entrambe le possibilità
      promotion = await promotionModuleService.createPromotions(payload);
      promotion = Array.isArray(promotion) ? promotion[0] : promotion;
    } else if (typeof promotionModuleService.create === "function") {
      promotion = await promotionModuleService.create(payload);
    } else {
      throw new Error("Nessun metodo di creazione promozione disponibile sul servizio.");
    }

    // assicurati che promotion abbia un id
    const promotionId = promotion?.id ?? null;

    // StepResponse: primo arg = dati restituiti dal passo, secondo arg = output che può essere usato come id per rollback
    return new StepResponse({ promotion }, promotionId);
  },
  // rollback/cleanup
  async (promotionId: any, { container }: { container: any }) => {
    if (!promotionId) return;

    const promotionModuleService: any = container.resolve(Modules.PROMOTION);

    try {
      if (typeof promotionModuleService.deletePromotions === "function") {
        // deletePromotions potrebbe accettare singolo id o array
        await promotionModuleService.deletePromotions(promotionId);
      } else if (typeof promotionModuleService.delete === "function") {
        await promotionModuleService.delete(promotionId);
      } else {
        // fallback: niente da fare
        console.warn("Metodo di cancellazione promozione non disponibile.");
      }
    } catch (err) {
      console.error("Errore durante rollback promozione:", err);
    }
  }
);

