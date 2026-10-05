import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL ?? "postgresql://f1_user:f1_dev_password@localhost:5432/f1_system";
const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });
