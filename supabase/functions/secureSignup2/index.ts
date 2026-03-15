import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, password, firstName, lastName, profileColor } = await req.json();

    // Validate required fields
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "E-Mail und Passwort sind erforderlich." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Domain restriction: only @putzmeister.com
    if (!email.toLowerCase().endsWith("@putzmeister.com")) {
      return new Response(
        JSON.stringify({ error: "Nur @putzmeister.com E-Mail-Adressen sind erlaubt." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Password strength: minimum 8 characters
    if (password.length < 8) {
      return new Response(
        JSON.stringify({ error: "Das Passwort muss mindestens 8 Zeichen lang sein." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const displayName = [firstName, lastName].filter(Boolean).join(" ") ||
      email.split("@")[0];

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // user must confirm via email link
      user_metadata: {
        firstName:    firstName    || "",
        lastName:     lastName     || "",
        display_name: displayName,
        profileColor: profileColor || "",
      },
    });

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, userId: data.user?.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("secureSignup2 error:", err);
    return new Response(
      JSON.stringify({ error: "Interner Serverfehler." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
