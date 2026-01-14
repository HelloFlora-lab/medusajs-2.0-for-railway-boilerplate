import { authenticate, defineMiddlewares, validateAndTransformBody, validateAndTransformQuery } from "@medusajs/framework";


import { PostStoreReviewSchema } from "./store/reviews/validation-schemas";
import { GetStoreReviewsSchema } from "./store/reviews/route";
import { GetAdminReviewsSchema } from "./admin/reviews/route";
import { PostAdminUpdateReviewsStatusSchema } from "./admin/reviews/status/validation-schemas";




export default defineMiddlewares({
  routes: [


     // --- PRODUCTS REVIEWS ----
   {
      matcher: "/admin/reviews",
      method: ["GET"],
      middlewares: [
        validateAndTransformQuery(GetAdminReviewsSchema, {
          isList: true,
          defaults: [
            "id",
            "title",
            "content",
            "rating",
            "product_id",
            "customer_id",
            "status",
            "created_at",
            "updated_at",
            "product.*",
          ],
        }),
      ],
    },
     {
      matcher: "/admin/reviews/status",
      method: ["POST"],
      middlewares: [
        validateAndTransformBody(PostAdminUpdateReviewsStatusSchema),
      ],
    },
    {
      method: ["POST"], 
      matcher: "/store/reviews",
      middlewares: [
        authenticate("customer", ["session", "bearer"]),
        validateAndTransformBody(PostStoreReviewSchema),
      ],
    },

    {
      method: ["GET"], 
      matcher: "/store/reviews",
      middlewares: [
        validateAndTransformQuery(GetStoreReviewsSchema, {
          isList: true,
          defaults: [
           "id", 
            "rating", 
            "title", 
            "first_name", 
            "last_name", 
            "content", 
            "created_at",
          ],
        }),
      ],
    },

    {
      matcher: "/store/products/:id/reviews",
      methods: ["GET"],
      middlewares: [
        validateAndTransformQuery(GetStoreReviewsSchema, {
          isList: true,
          defaults: [
            "id", 
            "rating", 
            "title", 
            "first_name", 
            "last_name", 
            "content", 
            "created_at",
          ],
        }),
      ],
    },



    
    

  ]
})