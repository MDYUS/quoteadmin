import { neon } from "@netlify/neon";

export default async (req, context) => {
  const sql = neon();
  const leads = await sql`SELECT * FROM leads`;
  return new Response(JSON.stringify(leads), {
    headers: { "Content-Type": "application/json" }
  });
};
