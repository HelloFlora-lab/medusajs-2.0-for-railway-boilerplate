import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { orderPlacedNotificationWorkflow } from "../workflows/notification/order-placed-notification";
import { Modules } from "@medusajs/framework/utils";

export default async function orderPlacedHandler({
  event: { data },
  container
}: SubscriberArgs<{ id: string }>) {
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)



    try {
      await orderPlacedNotificationWorkflow(container)
        .run({
          input: data
        })
      } catch (error) {
        console.error("Error executing order placed notification workflow:", error);
    }


    try {
      await notificationModuleService.createNotifications({
        to: "",
        channel: "feed",
        template: "admin-ui",
        data: {
          title: "New order received",
          description: `A new order has been placed with ID: ${data.id}`,
        },
        
      })
      console.log(`Evento 'order.placed' ricevuto order ID: ${data.id}`);
  } catch (error) {
    console.error("Error creating admin notification for order placed:", error);
  }

}

export const config: SubscriberConfig = {
  event: "order.placed"
}