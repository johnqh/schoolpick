import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import { env, httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/agentmail/webhook",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    if (env.AGENTMAIL_WEBHOOK_SECRET) {
      const suppliedSecret = req.headers.get("x-schoolpick-webhook-secret");
      if (suppliedSecret !== env.AGENTMAIL_WEBHOOK_SECRET) {
        return jsonResponse({ error: "Unauthorized" }, 401);
      }
    }

    let payload: unknown;
    try {
      payload = await req.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON" }, 400);
    }

    const event = asRecord(payload);
    if (!event) {
      return jsonResponse({ error: "Webhook body must be an object" }, 400);
    }

    const eventType = asString(event.event_type);
    if (eventType !== "message.received") {
      return jsonResponse({ ignored: true, eventType }, 200);
    }

    const message = asRecord(event.message);
    if (!message) {
      return jsonResponse({ error: "message.received missing message" }, 400);
    }

    const providerMessageId = asString(message.message_id);
    const providerThreadId = asString(message.thread_id);
    const from = asString(message.from);
    const subject = asString(message.subject) ?? "Admissions reply";
    const body =
      asString(message.extracted_text) ??
      asString(message.text) ??
      asString(message.preview) ??
      "";

    if (!providerMessageId || !providerThreadId || !from || !body) {
      return jsonResponse(
        { error: "message.received missing required message fields" },
        400,
      );
    }

    const result: { matched: boolean; duplicate: boolean } =
      await ctx.runMutation(internal.schoolpick.recordInboundAgentMailMessage, {
        providerMessageId,
        providerThreadId,
        eventId: asString(event.event_id) ?? undefined,
        from,
        to: asStringArray(message.to).join(", "),
        subject,
        body,
      });

    return jsonResponse({ ok: true, ...result }, 200);
  }),
});

function jsonResponse(value: unknown, status: number) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function asString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function asStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter(
        (item): item is string =>
          typeof item === "string" && item.trim().length > 0,
      )
    : [];
}

export default http;
