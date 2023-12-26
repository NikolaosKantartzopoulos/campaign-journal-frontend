import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

//check if we are running in production mode
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  //check if there is already a connection to the database
  // @ts-expect-error
  if (!global.prisma) {
    // @ts-expect-error
    global.prisma = new PrismaClient();
  }
  // @ts-expect-error
  prisma = global.prisma;
}

export { prisma };
