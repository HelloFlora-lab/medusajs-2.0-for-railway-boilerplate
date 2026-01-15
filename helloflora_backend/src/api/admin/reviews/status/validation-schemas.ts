import { z } from "zod"

export const PostAdminUpdateReviewsStatusSchema = z.object({
  ids: z.array(z.string()),
  status: z.enum(["pending", "approved", "rejected"]),
})