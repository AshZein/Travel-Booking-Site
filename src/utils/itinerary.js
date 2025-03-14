import { prisma } from "@/utils/db";

async function generateItineraryRef() {
  let lastId = await prisma.LastGeneratedId.findUnique({
    where: {
        type: 'itinerary'
    }
  });
  
  // if no lastId, create one
  if (!lastId){
    lastId = await prisma.LastGeneratedId.create({
        data: {
            type: 'itinerary',
            value: 1
        }
    });
  }
  const idString = lastId.value.toString().padStart(5, '0');

  // increment lastId
  await prisma.LastGeneratedId.update({
    where: {
        type: 'itinerary'
    },
    data: {
        value: lastId.value + 1
    }
  });

  return `itin-${idString}`;
}

export { generateItineraryRef };