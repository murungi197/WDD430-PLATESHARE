import "server-only";

import { z } from "zod";

import { ListingCategory, ListingStatus } from "@/generated/prisma/client";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export const listingCategories = [
  { value: ListingCategory.PRODUCE, label: "Produce" },
  { value: ListingCategory.BAKERY, label: "Bakery" },
  { value: ListingCategory.DAIRY, label: "Dairy" },
  { value: ListingCategory.PANTRY, label: "Pantry" },
  { value: ListingCategory.PREPARED, label: "Prepared food" },
  { value: ListingCategory.OTHER, label: "Other" },
] as const;

const browseFilterSchema = z.object({
  q: z.string().trim().max(100).optional(),
  category: z.enum(ListingCategory).optional(),
});

export type BrowseFilters = z.infer<typeof browseFilterSchema>;

export const publicListingSelect = {
  id: true,
  title: true,
  description: true,
  category: true,
  quantity: true,
  foodDetails: true,
  allergenInfo: true,
  pickupStartsAt: true,
  pickupEndsAt: true,
  status: true,
} satisfies Prisma.ListingSelect;

export function parseBrowseFilters(input: {
  q?: string;
  category?: string;
}) {
  return browseFilterSchema.safeParse({
    q: input.q?.trim() || undefined,
    category: input.category || undefined,
  });
}

function availableListingWhere(
  filters: BrowseFilters,
  now: Date,
): Prisma.ListingWhereInput {
  return {
    status: ListingStatus.AVAILABLE,
    pickupEndsAt: { gt: now },
    claims: { none: { status: "ACTIVE" } },
    ...(filters.category ? { category: filters.category } : {}),
    ...(filters.q
      ? {
          OR: [
            { title: { contains: filters.q, mode: "insensitive" } },
            { description: { contains: filters.q, mode: "insensitive" } },
            { foodDetails: { contains: filters.q, mode: "insensitive" } },
            { allergenInfo: { contains: filters.q, mode: "insensitive" } },
          ],
        }
      : {}),
  };
}

export async function getAvailableListings(filters: BrowseFilters) {
  return prisma.listing.findMany({
    where: availableListingWhere(filters, new Date()),
    select: publicListingSelect,
    orderBy: [{ pickupStartsAt: "asc" }, { createdAt: "desc" }],
  });
}

export async function getAvailableListing(id: string) {
  return prisma.listing.findFirst({
    where: {
      id,
      ...availableListingWhere({}, new Date()),
    },
    select: publicListingSelect,
  });
}

export function getCategoryLabel(category: ListingCategory) {
  return (
    listingCategories.find((item) => item.value === category)?.label ?? "Other"
  );
}
