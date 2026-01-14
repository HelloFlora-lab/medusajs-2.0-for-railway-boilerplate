import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { updateReviewWorkflow } from "../../../../workflows/product-review.ts/update-review"
import { z } from "zod"
import { PostAdminUpdateReviewsStatusSchema } from "./validation-schemas"



export async function POST(
  req: MedusaRequest<z.infer<typeof PostAdminUpdateReviewsStatusSchema>>, 
  res: MedusaResponse
) {
  const { ids, status } = req.validatedBody

  const { result } = await updateReviewWorkflow(req.scope).run({
    input: ids.map((id) => ({
      id,
      status,
    })),
  })

  res.json(result)
}