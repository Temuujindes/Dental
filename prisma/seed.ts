import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: "admin@dentabook.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@dentabook.com",
      password: await bcrypt.hash("admin123", 12),
      role: "ADMIN"
    }
  });

  const doctors = [
    {
      name: "Dr. Sarah Johnson",
      specialty: "General Dentistry",
      bio: "15 years of experience in general and preventive dental care.",
      experience: 15,
      rating: 4.9
    },
    {
      name: "Dr. Michael Chen",
      specialty: "Orthodontics",
      bio: "Specialist in braces and Invisalign with a focus on adult orthodontics.",
      experience: 12,
      rating: 4.8
    },
    {
      name: "Dr. Emily Roberts",
      specialty: "Cosmetic Dentistry",
      bio: "Expert in teeth whitening, veneers, and smile makeovers.",
      experience: 10,
      rating: 4.9
    }
  ];

  for (const doctor of doctors) {
    await prisma.doctor.upsert({
      where: { name: doctor.name },
      update: doctor,
      create: doctor
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
