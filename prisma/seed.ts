import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { addDays, format } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 12);
  const patientPassword = await bcrypt.hash("patient123", 12);

  await prisma.user.upsert({
    where: { email: "admin@dentabook.mn" },
    update: { name: "Админ", password: adminPassword, role: "ADMIN" },
    create: {
      name: "Админ",
      email: "admin@dentabook.mn",
      password: adminPassword,
      role: "ADMIN"
    }
  });

  const patient = await prisma.user.upsert({
    where: { email: "patient@dentabook.mn" },
    update: { name: "Тест Өвчтөн", password: patientPassword, role: "PATIENT" },
    create: {
      name: "Тест Өвчтөн",
      email: "patient@dentabook.mn",
      password: patientPassword,
      role: "PATIENT"
    }
  });

  const doctors = [
    {
      name: "Д. Сарантуяа",
      specialty: "Ерөнхий шүдний эмч",
      bio: "Ерөнхий үзлэг болон урьдчилан сэргийлэх эмчилгээний чиглэлээр туршлагатай.",
      experience: 12,
      rating: 4.9
    },
    {
      name: "Б. Мөнхбат",
      specialty: "Ортодонт",
      bio: "Шүд тэгшлэх, аппаратан эмчилгээний нарийн мэргэжилтэй.",
      experience: 8,
      rating: 4.7
    },
    {
      name: "Г. Энхтуяа",
      specialty: "Хүүхдийн шүдний эмч",
      bio: "Хүүхдийн шүдний эмчилгээ, урьдчилан сэргийлэлтээр мэргэшсэн.",
      experience: 10,
      rating: 4.8
    },
    {
      name: "О. Баярмаа",
      specialty: "Гоо сайхны шүдний эмч",
      bio: "Гоо сайхны эмчилгээ, шүд цайруулалт, инээмсэглэлийн дизайн хийдэг.",
      experience: 6,
      rating: 4.9
    },
    {
      name: "Т. Дорж",
      specialty: "Мэс заслын шүдний эмч",
      bio: "Шүд авах болон мэс заслын нарийн процедурууд дээр туршлагатай.",
      experience: 15,
      rating: 4.6
    },
    {
      name: "Н. Өлзийбаяр",
      specialty: "Эндодонт",
      bio: "Суваг эмчилгээ, өвдөлттэй тохиолдлын оношилгоогоор мэргэшсэн.",
      experience: 9,
      rating: 4.8
    }
  ];

  const seededDoctorIds: string[] = [];
  for (const doctor of doctors) {
    const doctorRecord = await prisma.doctor.upsert({
      where: { name: doctor.name },
      update: doctor,
      create: doctor
    });
    seededDoctorIds.push(doctorRecord.id);

    await prisma.$executeRaw`DELETE FROM "DoctorSchedule" WHERE "doctorId" = ${doctorRecord.id}`;
    await prisma.$executeRaw`DELETE FROM "BreakTime" WHERE "doctorId" = ${doctorRecord.id}`;
    await prisma.$executeRaw`DELETE FROM "BlockedSlot" WHERE "doctorId" = ${doctorRecord.id}`;

    for (const dayOfWeek of [1, 2, 3, 4, 5, 6]) {
      await prisma.$executeRaw`
        INSERT INTO "DoctorSchedule" ("id", "doctorId", "dayOfWeek", "startTime", "endTime", "slotDurationMinutes")
        VALUES (gen_random_uuid()::text, ${doctorRecord.id}, ${dayOfWeek}, '09:00', '17:00', 30)
      `;
      await prisma.$executeRaw`
        INSERT INTO "BreakTime" ("id", "doctorId", "dayOfWeek", "startTime", "endTime")
        VALUES (gen_random_uuid()::text, ${doctorRecord.id}, ${dayOfWeek}, '12:00', '13:00')
      `;
    }
  }

  await prisma.appointment.deleteMany({
    where: {
      patientId: patient.id,
      service: { in: ["Ерөнхий үзлэг", "Шүд цэвэрлэгэ", "Шүд авалт", "Суурь эмчилгээ", "Шүд цайруулга"] }
    }
  });

  const baseDate = new Date();
  baseDate.setHours(0, 0, 0, 0);
  const sample = [
    { dayOffset: 1, startTime: "10:00", endTime: "10:30", service: "Ерөнхий үзлэг", status: "PENDING" as const },
    { dayOffset: 2, startTime: "11:00", endTime: "11:30", service: "Шүд цэвэрлэгэ", status: "CONFIRMED" as const },
    { dayOffset: 3, startTime: "14:00", endTime: "14:30", service: "Шүд авалт", status: "CANCELLED" as const },
    { dayOffset: 4, startTime: "15:00", endTime: "15:30", service: "Суурь эмчилгээ", status: "COMPLETED" as const },
    { dayOffset: 5, startTime: "09:30", endTime: "10:00", service: "Шүд цайруулга", status: "PENDING" as const }
  ];

  for (let i = 0; i < sample.length; i += 1) {
    const item = sample[i];
    const date = addDays(baseDate, item.dayOffset);
    await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: seededDoctorIds[i % seededDoctorIds.length],
        date,
        startTime: item.startTime,
        endTime: item.endTime,
        service: item.service,
        status: item.status,
        notes: `Seeded ${format(date, "yyyy-MM-dd")}`
      }
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
