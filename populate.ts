import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { Octokit } from "@octokit/rest";
const octokit = new Octokit();

octokit.repos
  .listForUser({
    username: "owenrummage",
  })
  .then(({ data }) => {
    data.forEach(async (repo) => {
      await prisma.project.deleteMany();

      var id = await prisma.project.upsert({
        where: {
          id: repo.id,
        },
        create: {
          name: repo.name,
          description: repo.description,
          url: repo.html_url,
          stars: repo.stargazers_count || 0,
          id: repo.id,
        },
        update: {
          name: repo.name,
          description: repo.description,
          url: repo.html_url,
          stars: repo.stargazers_count || 0,
        },
      });

      console.log(`Add repo ${repo.name} with id ${id.id}`);
    });
  });
