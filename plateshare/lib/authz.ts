import "server-only";

import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getCurrentMember() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

export async function requireMember() {
  const member = await getCurrentMember();

  if (!member) {
    redirect("/sign-in");
  }

  return member;
}

export async function requireListingOwner(listingId: string) {
  const member = await requireMember();
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { id: true, ownerId: true },
  });

  if (!listing || listing.ownerId !== member.id) {
    notFound();
  }

  return { member, listing };
}

export async function getPickupDetailsForParticipant(listingId: string) {
  const member = await getCurrentMember();

  if (!member) {
    return null;
  }

  return prisma.listing.findFirst({
    where: {
      id: listingId,
      OR: [
        { ownerId: member.id },
        {
          claims: {
            some: {
              claimantId: member.id,
              status: { in: ["ACTIVE", "COMPLETED"] },
            },
          },
        },
      ],
    },
    select: {
      pickupAddress: true,
      pickupInstructions: true,
    },
  });
}
