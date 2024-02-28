import type { APIRoute } from "astro";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const GET: APIRoute = async () => {
  const productsCount = await prisma.quote.count();
  const skip = Math.floor(Math.random() * productsCount);
  const quote = await prisma.quote.findMany({
    take: 1,
    skip: skip,
  });

  return new Response(JSON.stringify(quote), { status: 200 });
};
