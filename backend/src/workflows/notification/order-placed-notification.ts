import { 
  createWorkflow, 
} from "@medusajs/framework/workflows-sdk"
import { sendNotificationsStep, useQueryGraphStep } from "@medusajs/medusa/core-flows"

type WorkflowInput = {
  id: string
}

export const orderPlacedNotificationWorkflow = createWorkflow(
  "order-placed-notification",
  ({ id }: WorkflowInput) => {

    const { data: orders } = useQueryGraphStep({
      entity: "order",
      fields: [
        "id",
        "display_id", 
        "email",
        "shipping_address.*",
        "subtotal",
        "shipping_total",
        "currency_code", 
        "discount_total",
        "tax_total",
        "total",
        "items.*",
        "original_total"
      ],
      filters: {
        id,
      },
    })


     const fromEmail = process.env.SENDGRID_FROM;
    //const backendUrl = process.env.MEDUSA_BACKEND_URL; //config.admin.backendUrl !== "/" ? config.admin.backendUrl : "https://helloflora-backend.helloflora.net"
    const orderTemplateId = process.env.SENDGRID_MODEL_ORDER_NEW;

    if (!fromEmail || !orderTemplateId) {
        console.error("Variabili d'ambiente SendGrid o BACKEND_URL mancanti. Impossibile inviare la notifica ordine.");
        return;
    }

    sendNotificationsStep(
      [
        {
      to: "slack-channel",
      channel: "slack",
      template: "order-created",
      data: {
        order: orders[0]
      }
    },

    //Notifica email al Team di HelloFlora
    {
      
      to: "admin@helloflora.net",
      channel: "email",
      template: process.env.SENDGRID_MODEL_ORDER_NEW!,
        data: {
          order_id: (orders[0] as any).display_id,
          order_email:  orders[0].email,
          items: orders[0].items,
          subtotal: orders[0].subtotal,
          shipping_total: orders[0].shipping_total,
          discount_total: orders[0].discount_total,
          total: orders[0].total,
          currency_code: orders[0].currency_code, 
      },
    },

    //Notifica email al Cliente
    {
      
      to: orders[0].email!,
      channel: "email",
      template: process.env.SENDGRID_MODEL_ORDER_NEW!,
        data: {
          order_id: (orders[0] as any).display_id,
          order_email:  orders[0].email,
      },
    }
  
  ])
  }
)