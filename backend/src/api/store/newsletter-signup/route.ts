import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { Modules } from "@medusajs/utils";
import { createPromotionWorkflow } from "../../../workflows/promotion/create-promotion";
import client from "@sendgrid/client";

async function addContactToSendGrid(email: string, listId: string, promoCode?: string) {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error("SENDGRID_API_KEY non impostata");
  }
  if (!listId) {
    throw new Error("SENDGRID_NEWSLETTERLIST_ID non impostata");
  }

  // opzionale: id del custom field in SendGrid (es. "e1_Txxx")
  const promoCustomFieldId = process.env.SENDGRID_PROMO_CUSTOM_FIELD_ID || null;

  client.setApiKey(process.env.SENDGRID_API_KEY);

  const contact: any = { email };

  // se abbiamo codice promozionale e un custom field id configurato, includilo
  if (promoCode && promoCustomFieldId) {
    contact.custom_fields = {
      [promoCustomFieldId]: promoCode,
    };
  }

  // log diagnostici prima della chiamata
  console.info("[newsletter-signup] addContactToSendGrid: adding contact", {
    email,
    listId,
    hasPromoCode: Boolean(promoCode),
    promoCode,
    promoCustomFieldId,
  });
  console.debug("[newsletter-signup] addContactToSendGrid: contact payload", contact);

  const payload = {
    list_ids: [listId],
    contacts: [contact],
  };

  const request = {
    method: "PUT",
    url: "/v3/marketing/contacts",
    body: payload,
  };

  const [response, body] = await client.request(request as any);

  // log diagnostici della risposta SendGrid
  console.info("[newsletter-signup] SendGrid response status:", response?.statusCode);
  console.debug("[newsletter-signup] SendGrid response body:", body);

  if (body?.errors) {
    console.error("[newsletter-signup] SendGrid returned errors:", body.errors);
  }

  if (![200, 201, 202].includes(response.statusCode)) {
    const errMsg = body?.errors ? JSON.stringify(body.errors) : `status ${response.statusCode}`;
    throw new Error(`SendGrid error: ${errMsg}`);
  }

  // verifica se il custom field è stato accettato / presente nella risposta (quando disponibile)
  // SendGrid può non restituire i contatti aggiornati immediatamente, ma logghiamo info utili
  if (promoCode && promoCustomFieldId) {
    // se body contiene job_id o persisted_recipients possiamo loggare
    if (body?.job_id) {
      console.info("[newsletter-signup] SendGrid job created:", body.job_id);
    }
    if (body?.persisted_recipients) {
      console.info("[newsletter-signup] SendGrid persisted recipients count:", body.persisted_recipients.length ?? body.persisted_recipients);
    }
  }

  return { response, body };
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  type NewsletterSignupBody = { email?: string };
  const { email } = req.body as NewsletterSignupBody;

  if (!email) {
    return res.status(400).json({ message: "Email è un campo richiesto per l'iscrizione." });
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    return res.status(400).json({ message: "Formato email non valido." });
  }

  try {
    // 1) crea la promozione tramite workflow
    console.info("[newsletter-signup] Running createPromotionWorkflow");
    const workflowExecution = await createPromotionWorkflow(req.scope).run();
    console.debug("[newsletter-signup] workflowExecution raw:", workflowExecution);

    // cerca il codice promozionale in più possibili path della response
    const result: any = workflowExecution?.result;
    const promoCode =
      result?.promotion?.code ??
      result?.promotion?.promotion?.code ??
      result?.code ??
      null;

    console.info("[newsletter-signup] promoCode derived from workflow:", promoCode);

    // 2) tenta di aggiungere il contatto a SendGrid (se configurato)
    let contactResult: { success: boolean; warning?: string } = { success: false };
    const sendgridListId = process.env.SENDGRID_NEWSLETTERLIST_ID || "";

    console.debug("[newsletter-signup] SendGrid config", {
      SENDGRID_API_KEY: Boolean(process.env.SENDGRID_API_KEY),
      SENDGRID_NEWSLETTERLIST_ID: Boolean(sendgridListId),
      SENDGRID_PROMO_CUSTOM_FIELD_ID: process.env.SENDGRID_PROMO_CUSTOM_FIELD_ID ?? null,
    });

    if (process.env.SENDGRID_API_KEY && sendgridListId) {
      try {
        const sendgridResp = await addContactToSendGrid(email, sendgridListId, promoCode || undefined);
        contactResult.success = true;

        // log esito dettagliato
        console.info("[newsletter-signup] addContactToSendGrid succeeded", {
          statusCode: sendgridResp.response?.statusCode,
        });

        if (!promoCode) {
          contactResult.warning = "Promocode non generato o non disponibile; contatto aggiunto senza campo promozione.";
        } else if (!process.env.SENDGRID_PROMO_CUSTOM_FIELD_ID) {
          contactResult.warning = "SENDGRID_PROMO_CUSTOM_FIELD_ID non configurato; il codice promozionale non è stato inviato come campo custom.";
        }
      } catch (err: any) {
        console.error("[newsletter-signup] addContactToSendGrid error:", err?.message || err);
        contactResult = { success: false, warning: err?.message || "Errore aggiunta contatto" };
      }
    } else {
      contactResult = { success: false, warning: "SendGrid non configurato; contatto non aggiunto" };
    }

    // 3) Rispondi al client con risultato del workflow e stato dell'aggiunta contatto
    return res.status(200).json({
      ok: true,
      workflow: workflowExecution?.result ?? workflowExecution,
      promoCode: promoCode ?? null,
      contact: contactResult,
    });
  } catch (error: any) {
    console.error("[newsletter-signup] error:", error);
    return res.status(500).json({
      ok: false,
      message: "Errore interno durante l'iscrizione alla newsletter.",
      details: error?.message ?? null,
    });
  }
}