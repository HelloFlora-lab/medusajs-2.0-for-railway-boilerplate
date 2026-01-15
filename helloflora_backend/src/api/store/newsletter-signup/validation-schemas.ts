import { z } from "zod"

export const PostStoreNewsletterSchema = z.object({
  email: z.string().email()
  
})