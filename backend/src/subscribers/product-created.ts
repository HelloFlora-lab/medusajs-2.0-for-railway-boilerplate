import type {
  SubscriberArgs,
  SubscriberConfig,
} from "@medusajs/framework"

import { Modules } from "@medusajs/framework/utils"
import { sendEmailWorkflow } from "../workflows/notification/send-email"

export default async function productCreateHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  await sendEmailWorkflow(container).run({
    input: {
      id: data.id,
    },
  })
}


/*
export default async function productCreateHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)
  const query = container.resolve("query")

  const { data: [product] } = await query.graph({
    entity: "product",
    fields: ["*"],
    filters: {
      id: data.id,
    },
  })

  await notificationModuleService.createNotifications({
    to: "cristian@helloflora.net",
    channel: "email",
    template: "d-caee907cc44c41dca79018edaeccd6f2",
    data: {
      product_title: product.title,
      //product_image: product.images[0]?.url,
    },
  })
}

*/



export const config: SubscriberConfig = {
  event: "product.created",
}