import { z } from "zod"

export const PostNearbyFloristsSchema = z.object({
  lat: z.number(),
  lng: z.number(),

})

export const GetFloristDetailSchema = z.object({
  id: z.string(),
})