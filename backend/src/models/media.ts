import prisma from "@config/db";

export async function saveMedia(
  uuid: string,
  files: { path: string; type: string; name: string }[]
) {
  const media = await prisma.media.createMany({
    data: files.map((path) => ({
      uuid,
      path: path.path,
      type: path.type,
      name: path.name,
    })),
  });

  return media;
}

export async function getMedia(uuid: string) {
  const media = await prisma.media.findMany({
    where: {
      uuid,
    },
  });

  return media;
}
