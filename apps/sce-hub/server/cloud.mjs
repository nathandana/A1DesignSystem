import { createClient } from "@supabase/supabase-js";
import { openPostgresStore } from "./postgres-store.mjs";
export function cloudServices(env = process.env) {
  const supabase = createClient(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  const bucket = supabase.storage.from("sce-private-reports");
  const storage = {
    async put(key, bytes) {
      const { error } = await bucket.upload(key, bytes, {
        contentType: "application/pdf",
        upsert: false,
      });
      if (error) throw error;
    },
    async get(key) {
      const { data, error } = await bucket.download(key);
      if (error) throw error;
      return Buffer.from(await data.arrayBuffer());
    },
    async remove(key) {
      const { error } = await bucket.remove([key]);
      if (error) throw error;
    },
  };
  return {
    store: openPostgresStore({
      connectionString: env.SCE_DATABASE_URL,
      storage,
    }),
    async externalAuth(email, password) {
      // A stateless password check; never retain a shared Supabase user's session.
      const response = await fetch(
        `${env.SUPABASE_URL}/auth/v1/token?grant_type=password`,
        {
          method: "POST",
          headers: {
            apikey: env.SUPABASE_SERVICE_ROLE_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );
      if (!response.ok) return null;
      const result = await response.json();
      return result.user;
    },
  };
}
