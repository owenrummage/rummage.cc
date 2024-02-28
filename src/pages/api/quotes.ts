import type { APIRoute } from "astro";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const GET: APIRoute = async () => {
  const quotes = await prisma.quote.findMany();
  return new Response(JSON.stringify(quotes), { status: 200 });
};
