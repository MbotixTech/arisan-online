import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");


  const membersData = [
    { name: "Siti Aminah", phone: "081234567890", address: "Jl. Mawar No. 12, Jakarta" },
    { name: "Dewi Sartika", phone: "081234567891", address: "Jl. Melati No. 45, Jakarta" },
    { name: "Ratna Dewi", phone: "081234567892", address: "Jl. Anggrek No. 78, Jakarta" },
    { name: "Rina Susanti", phone: "081234567893", address: "Jl. Kenanga No. 23, Jakarta" },
    { name: "Sri Wahyuni", phone: "081234567894", address: "Jl. Dahlia No. 56, Jakarta" },
  ];

  for (const m of membersData) {
    await prisma.member.create({ data: m });
  }


  const arisan = await prisma.arisanPeriod.create({
    data: {
      name: "Arisan Bulanan 2024",
      amount: 500000,
      durationMonths: 12,
      status: "active",
    },
  });


  const members = await prisma.member.findMany();
  for (const m of members) {
    await prisma.payment.create({
      data: {
        memberId: m.id,
        arisanId: arisan.id,
        amount: 500000,
        paymentDate: new Date(),
      },
    });
  }

  console.log("Seeding completed.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
