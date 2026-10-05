import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction([
    prisma.highlight.deleteMany(),
    prisma.news.deleteMany(),
    prisma.galleryItem.deleteMany(),
    prisma.ranking.deleteMany(),
    prisma.emblem.deleteMany(),
    prisma.recentPost.deleteMany(),
    prisma.server.deleteMany(),
    prisma.communityUser.deleteMany(),
    prisma.latestEvent.deleteMany(),
    prisma.storeProduct.deleteMany(),
  ]);
  console.log('Dados de exemplo removidos.');
}

main().finally(() => prisma.$disconnect());