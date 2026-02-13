import { httpRouter } from "convex/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();


http.route({
    path : "/clerk-webhook",
    method : "POST",

    handler: httpAction(async (ctx, request) => {
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
        if (!webhookSecret) {
            console.error("CLERK_WEBHOOK_SECRET is not set");
            return new Response("Webhook secret not configured", { status: 500 });
        }

        const svix_id = request.headers.get("svix-id");
        const svix_timestamp = request.headers.get("svix-timestamp");
        const svix_signature = request.headers.get("svix-signature");

        if (!svix_id || !svix_timestamp || !svix_signature) {
            return new Response("Missing Svix headers", { status: 400 });
        }

        const payload = await request.text();

        const wh = new Webhook(webhookSecret);
        let evt: WebhookEvent;


        try {evt = wh.verify(payload, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
        } catch (err) {
            console.error("Webhook verification failed:", err);
            return new Response("Invalid webhook signature", { status: 400 });
        }
        
        const eventType = evt.type;
        if (eventType === "user.created") {
            const { id, email_addresses, first_name, last_name } = evt.data;

            const email= email_addresses[0].email_address;
            const name = `${first_name || ""} ${last_name || ""}`.trim();
            try{
               await ctx.runMutation(api.users.syncUser, {
                    userId: id,
                    email,
                    name,
                });
            }
            catch(err){
                console.error("Failed to save user:", err);
                return new Response("Failed to save user", { status: 500 });
            }
        }
        return new Response("Webhook received", { status: 200 });
    }),
});

export default http;
