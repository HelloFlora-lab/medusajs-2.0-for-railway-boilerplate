import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { createPromotionStep } from "./steps/create-promotion";

export const createPromotionWorkflow = createWorkflow("create-promotion", (input: any) => {
  // createPromotionStep() restituisce l'oggetto step; destrutturiamo la proprietà `promotion`
  const { promotion } = createPromotionStep(input);

  return new WorkflowResponse({
    promotion,
  });
});