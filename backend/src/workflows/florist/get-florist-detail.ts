import { 
  createWorkflow, 
  WorkflowData, 
  WorkflowResponse, 
  transform
} from "@medusajs/framework/workflows-sdk";
import { getFloristDetailStep } from "./steps/get-florist-detail";


export type StepInput = {
  place_id: string;
}



export const getFloristDetailWorkflow = createWorkflow(
  "get-florist-detail",
  (input: StepInput) => {

    const floristDetails = getFloristDetailStep(input);

    return new WorkflowResponse({
      floristDetails,
    })
  }
)