import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { toEmail, toName, fromName, commentText } = await req.json();

    if (!toEmail || !toName || !fromName || !commentText) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const safeText = commentText
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br>");

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: Deno.env.get("FROM_EMAIL") ?? "Shopfloorboard <noreply@yourdomain.com>",
        to: [toEmail],
        subject: `${fromName} hat dich erwähnt`,
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;margin:0 auto;background:#f5f6f8;border-radius:12px;overflow:hidden;">

            <div style="background:#464B52;padding:18px 24px;display:flex;align-items:center;gap:10px;">
              <div style="width:8px;height:8px;background:#FFCC00;border-radius:50%;flex-shrink:0;"></div>
              <span style="color:white;font-size:14px;font-weight:700;letter-spacing:0.3px;">Shopfloorboard PCP Aichtal</span>
            </div>

            <div style="padding:24px;">
              <p style="color:#555a5a;margin:0 0 6px;font-size:15px;">Hallo <strong>${toName}</strong>,</p>
              <p style="color:#888;margin:0 0 20px;font-size:14px;">
                <strong style="color:#555a5a;">${fromName}</strong> hat dich in einem Kommentar erwähnt:
              </p>

              <div style="background:white;border-radius:10px;border-left:3px solid #FFCC00;padding:14px 18px;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
                <p style="margin:0;color:#374151;font-size:14px;line-height:1.6;">${safeText}</p>
              </div>
            </div>

            <div style="background:#FFCC00;padding:10px 24px;text-align:center;">
              <span style="font-size:11px;color:#555a5a;font-weight:600;">Shopfloorboard PCP Aichtal</span>
            </div>

          </div>
        `,
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error("Resend error:", errorBody);
      return new Response(JSON.stringify({ error: errorBody }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Function error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
