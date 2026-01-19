import prisma from "../src/prismaClient.js";

async function main() {

  await prisma.playlistSong.deleteMany();
  await prisma.playlist.deleteMany();
  await prisma.song.deleteMany();
  await prisma.user.deleteMany();

  
  const user1 = await prisma.user.create({
    data: { username: "user1", password: Buffer.from("user1").toString("base64") },
  });

  const user2 = await prisma.user.create({
    data: { username: "user2", password: Buffer.from("user2").toString("base64") },
  });

  
  const songsData = [
    { title: "Lose Yourself", artist: "Eminem", duration: 326 },
    { title: "Numb", artist: "Linkin Park", duration: 185 },
    { title: "Blinding Lights", artist: "The Weeknd", duration: 200 },
    { title: "Shape of You", artist: "Ed Sheeran", duration: 240 },
    { title: "Believer", artist: "Imagine Dragons", duration: 204 },
    { title: "Bad Guy", artist: "Billie Eilish", duration: 194 },
  ];

  await prisma.song.createMany({ data: songsData });
  const allSongs = await prisma.song.findMany();


  const playlist1 = await prisma.playlist.create({ data: { name: "Workout Hits" } });
  const playlist2 = await prisma.playlist.create({ data: { name: "Chill Vibes" } });
  const playlist3 = await prisma.playlist.create({ data: { name: "Road Trip" } });


  await prisma.playlistSong.createMany({
    data: [
      { playlistId: playlist1.id, songId: allSongs[0].id },
      { playlistId: playlist1.id, songId: allSongs[1].id },
      { playlistId: playlist1.id, songId: allSongs[2].id },

      { playlistId: playlist2.id, songId: allSongs[3].id },
      { playlistId: playlist2.id, songId: allSongs[4].id },

      { playlistId: playlist3.id, songId: allSongs[1].id },
      { playlistId: playlist3.id, songId: allSongs[5].id },
    ],
  });

  console.log(" Seed uspješno ubačen!");
 
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
