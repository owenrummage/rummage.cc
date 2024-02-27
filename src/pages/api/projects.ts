import type { APIRoute } from "astro";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const GET: APIRoute = async () => {
  const projects = await prisma.project.findMany();
  return new Response(JSON.stringify(projects), { status: 200 });
};
