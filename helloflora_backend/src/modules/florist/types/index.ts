import { z } from "zod";
import { createFindParams } from "@medusajs/medusa/api/utils/validators";


export enum FloristStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected"
}


// Zod schema for FloristDTO
export const FloristDTOSchema = z.object({

  id: z.string(),
  name: z.string(),
  company_name: z.string().optional(),
  address: z.string(),
  city: z.string(),
  county: z.string(),
  country: z.string(),
  zip_code: z.string(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
  main_phone: z.string(),
  second_phone: z.string().optional(),
  email: z.string().optional(),
  website: z.string().optional(),
  note: z.string().optional(),
  close_time: z.string().optional(),
  is_open: z.boolean().optional(),
  image_url: z.string().optional(),
  iban: z.string().optional(),
  rate: z.number(),
  florist_status: z.nativeEnum(FloristStatus),
  created_at: z.date(),
  updated_at: z.date(),
  // products: z.array(ProductDTOSchema).optional(), // Uncomment and define ProductDTOSchema if needed

});

export const CreateFloristSchema = z.object({

    name: z.string().min(1, "Name is required"),
    company_name:z.string().optional(),

    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    county: z.string().min(1, "County is required"),
    country: z.string().min(1, "Country is required"),
    zip_code: z.string().min(1, "Zip code is required"),

    location: z.object({
        lat: z.number(),
        lng: z.number(),
    }).optional(),

    main_phone: z.string().min(1, "Main phone is required"),
    second_phone: z.string().optional(),
    email: z.string().email("Invalid email address").optional(),
    website: z.string().optional(),

    note: z.string().optional(),
    close_time: z.string().optional(),
    is_open: z.boolean().optional(),

    image_url: z.string().optional(),
    iban: z.string().optional(),

    florist_status: z.nativeEnum(FloristStatus).optional().default(FloristStatus.PENDING),

});


export type GetFloristDTO = z.infer<typeof FloristDTOSchema>;

export const UpdateFloristSchema = CreateFloristSchema.partial();
export type UpdateFloristDTO = z.infer<typeof UpdateFloristSchema>;

export const DeleteFloristsSchema = createFindParams()
export type DeleteFloristsDTO = z.infer<typeof DeleteFloristsSchema>;