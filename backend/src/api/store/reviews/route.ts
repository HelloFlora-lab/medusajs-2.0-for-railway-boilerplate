import type {
  AuthenticatedMedusaRequest,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { createReviewWorkflow } from "../../../workflows/product-review.ts/create-review"
import { PostStoreReviewSchema } from "./validation-schemas"
import { z } from "zod"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"


type PostStoreReviewReq = z.infer<typeof PostStoreReviewSchema>


export const GetStoreReviewsSchema = createFindParams()


export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve("query")
  
  const { 
    data: reviews, 
    metadata: { count, take, skip } = {
      count: 0,
      take: 20,
      skip: 0,
    },
  } = await query.graph({
    entity: "review",
    ...req.queryConfig,
  })

  res.json({ 
    reviews,
    count,
    limit: take,
    offset: skip,
  })
}


export const POST = async (
  req: AuthenticatedMedusaRequest<PostStoreReviewReq>,
  res: MedusaResponse
) => {
  const input = req.validatedBody

  const { result } = await createReviewWorkflow(req.scope)
    .run({
      input: {
        ...input,
        customer_id: req.auth_context?.actor_id,
        content: input.content ?? "",
        rating: input.rating ?? 0,
        product_id: input.product_id ?? "",
        // --- INIZIO CORREZIONE FINALE ---
        // Forniamo valori di default per tutte le proprietà di stringa rimanenti
        first_name: input.first_name ?? "",
        last_name: input.last_name ?? "",
        title: input.title ?? "",
        // --- FINE CORREZIONE FINALE ---
      },
    })

  res.json(result)
}