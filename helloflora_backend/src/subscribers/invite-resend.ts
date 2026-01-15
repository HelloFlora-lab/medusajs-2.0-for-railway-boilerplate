import {
  SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/medusa"
import { Modules } from "@medusajs/framework/utils"
import { INotificationModuleService, IUserModuleService } from "@medusajs/framework/types";

export default async function userInviteResentHandler({
  event: { data },
  container,
}: SubscriberArgs<any>) {

    const fromEmail = process.env.SENDGRID_FROM;
    const backendUrl = process.env.MEDUSA_BACKEND_URL; //config.admin.backendUrl !== "/" ? config.admin.backendUrl : "https://helloflora-backend.helloflora.net"
    const inviteTemplateId = process.env.SENDGRID_MODEL_INVITE_USER;

    if (!fromEmail || !backendUrl || !inviteTemplateId) {
        console.error("Variabili d'ambiente SendGrid o BACKEND_URL mancanti. Impossibile inviare l'invito.");
        return;
    }

    const notificationModuleService: INotificationModuleService = container.resolve(Modules.NOTIFICATION);
    const userModuleService: IUserModuleService = container.resolve(Modules.USER);

    const invite = await userModuleService.retrieveInvite(data.id,);

    const {email, token} = invite;
    const inviteLink = `${backendUrl}/app/invite?token=${token}`;

    try {
      await notificationModuleService.createNotifications({
        to: email,
        channel: "email",
        template: inviteTemplateId,
        data: {invite_link: inviteLink,
        },
      });
      console.log(`Evento 'invite.resend' ricevuto per l'email: ${email}`);
      console.log(`Token: ${token}`);

    } catch (error) {
        console.error("Errore durante l'invio dell'invito via email:", error);
        return;
    }

    
}

export const config: SubscriberConfig = {
  event: "invite.resent",
}