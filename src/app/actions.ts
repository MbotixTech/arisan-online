"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getMembers() {
  return await prisma.member.findMany({
    where: { status: "active" },
    orderBy: { createdAt: "desc" },
  });
}

export async function addMember(formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;

  await prisma.member.create({
    data: { name, phone, address },
  });
  revalidatePath("/members");
  revalidatePath("/");
}

export async function updateMember(id: number, formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;

  await prisma.member.update({
    where: { id },
    data: { name, phone, address },
  });
  revalidatePath("/members");
}

export async function deleteMember(id: number) {
  await prisma.member.update({
    where: { id },
    data: { status: "inactive" },
  });
  revalidatePath("/members");
  revalidatePath("/");
}

export async function getArisanPeriods() {
  const periods = await prisma.arisanPeriod.findMany({
    where: { status: { not: "inactive" } },
    include: {
      winners: true,
      _count: { select: { winners: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return periods.map((p) => ({
    ...p,
    amount: p.amount.toNumber(),
  }));
}

export async function addArisanPeriod(formData: FormData) {
  const name = formData.get("name") as string;
  const amount = Number(formData.get("amount"));
  const durationMonths = Number(formData.get("durationMonths"));

  await prisma.arisanPeriod.create({
    data: { name, amount, durationMonths },
  });
  revalidatePath("/arisan");
  revalidatePath("/");
}

export async function updateArisanPeriod(id: number, formData: FormData) {
  const name = formData.get("name") as string;
  const amount = Number(formData.get("amount"));
  const durationMonths = Number(formData.get("durationMonths"));

  await prisma.arisanPeriod.update({
    where: { id },
    data: { name, amount, durationMonths },
  });
  revalidatePath("/arisan");
}

export async function deleteArisanPeriod(id: number) {
  await prisma.arisanPeriod.update({
    where: { id },
    data: { status: "inactive" },
  });
  revalidatePath("/arisan");
  revalidatePath("/");
}

export async function closeArisanPeriod(id: number) {
  await prisma.arisanPeriod.update({
    where: { id },
    data: { status: "completed" },
  });
  revalidatePath("/arisan");
}

export async function getPayments(arisanId?: number, memberName?: string) {
  const where: any = {};
  if (arisanId) where.arisanId = arisanId;
  if (memberName) {
    where.member = {
      name: { contains: memberName },
    };
  }

  const payments = await prisma.payment.findMany({
    where,
    include: {
      member: true,
      arisan: true,
    },
    orderBy: { paymentDate: "desc" },
  });

  return payments.map((p) => ({
    ...p,
    amount: p.amount.toNumber(),
    arisan: {
      ...p.arisan,
      amount: p.arisan.amount.toNumber(),
    },
  }));
}

export async function addPayment(formData: FormData) {
  const memberId = Number(formData.get("memberId"));
  const arisanId = Number(formData.get("arisanId"));
  const amount = Number(formData.get("amount"));
  const paymentDate = new Date(formData.get("paymentDate") as string);

  const existing = await prisma.payment.findFirst({
    where: {
      memberId,
      arisanId,
      paymentDate: {
        gte: new Date(paymentDate.getFullYear(), paymentDate.getMonth(), 1),
        lt: new Date(paymentDate.getFullYear(), paymentDate.getMonth() + 1, 1),
      },
    },
  });

  if (existing) {
    throw new Error("Pembayaran sudah ada untuk bulan ini");
  }

  await prisma.payment.create({
    data: { memberId, arisanId, amount, paymentDate },
  });
  revalidatePath("/payments");
  revalidatePath("/");
}

export async function deletePayment(id: number) {
  await prisma.payment.delete({
    where: { id },
  });
  revalidatePath("/payments");
  revalidatePath("/");
}

export async function getWinners() {
  const winners = await prisma.winner.findMany({
    include: {
      member: true,
      arisan: true,
    },
    orderBy: { drawDate: "desc" },
  });

  return winners.map((w) => ({
    ...w,
    arisan: {
      ...w.arisan,
      amount: w.arisan.amount.toNumber(),
    },
  }));
}

export async function drawWinner(arisanId: number) {
  const members = await prisma.member.findMany({ where: { status: "active" } });
  
  const existingWinners = await prisma.winner.findMany({
    where: { arisanId },
    select: { memberId: true },
  });
  const existingWinnerIds = new Set(existingWinners.map(w => w.memberId));

  const eligibleMembers = members.filter(m => !existingWinnerIds.has(m.id));

  if (eligibleMembers.length === 0) {
    throw new Error("Tidak ada anggota yang memenuhi syarat untuk menang");
  }

  const winner = eligibleMembers[Math.floor(Math.random() * eligibleMembers.length)];

  await prisma.winner.create({
    data: {
      arisanId,
      memberId: winner.id,
    },
  });
  revalidatePath("/winners");
  revalidatePath("/arisan");
  revalidatePath("/");
}

export async function getDashboardStats() {
  const [totalMembers, activeArisan, totalWinners, totalCollected] = await Promise.all([
    prisma.member.count({ where: { status: "active" } }),
    prisma.arisanPeriod.count({ where: { status: "active" } }),
    prisma.winner.count(),
    prisma.payment.aggregate({
      _sum: { amount: true },
    }),
  ]);

  const recentWinners = await prisma.winner.findMany({
    take: 5,
    orderBy: { drawDate: "desc" },
    include: { member: true, arisan: true },
  });

  const activeArisanList = await prisma.arisanPeriod.findMany({
    where: { status: "active" },
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  return {
    totalMembers,
    activeArisan,
    totalWinners,
    totalCollected: totalCollected._sum.amount?.toNumber() || 0,
    recentWinners: recentWinners.map((w) => ({
      ...w,
      arisan: {
        ...w.arisan,
        amount: w.arisan.amount.toNumber(),
      },
    })),
    activeArisanList: activeArisanList.map((a) => ({
      ...a,
      amount: a.amount.toNumber(),
    })),
  };
}
