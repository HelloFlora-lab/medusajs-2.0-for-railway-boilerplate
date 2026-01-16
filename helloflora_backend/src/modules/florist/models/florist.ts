import { model } from "@medusajs/framework/utils"


import { FloristStatus } from "../types"

export const Florist = model.define("Florist", {

    id: model
        .id({
          prefix: "frs",
        })
        .primaryKey(),
    name: model.text(),
    company_name: model.text().nullable(),
    
    address: model.text(),
    city: model.text(),
    county: model.text(),
    country: model.text(),
    zip_code: model.text(),
    
    // Aggiunto il campo location per le coordinate geografiche
    location: model.json().nullable(),

    main_phone: model.text(),
    second_phone: model.text().nullable(),
    email: model.text().nullable(),
    website: model.text().nullable(),
    
    note: model.text().nullable(),
    
    close_time: model.text().nullable(),
    is_open: model.boolean().default(false),
    
    image_url: model.text().nullable(),
      
    iban: model.text().nullable(),
    
    rate: model.number().nullable(),
    
    florist_status: model.enum(FloristStatus).default(FloristStatus.PENDING)

})

