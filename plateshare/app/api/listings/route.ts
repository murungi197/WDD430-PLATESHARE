import { NextResponse } from "next/server";

import { getAvailableListings, parseBrowseFilters } from "@/lib/listings";

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const parsedFilters = parseBrowseFilters({
    q: searchParams.get("q") ?? undefined,
    category: searchParams.get("category") ?? undefined,
  });

  if (!parsedFilters.success) {
    return NextResponse.json(
      { error: "The search filters are invalid." },
      { status: 400 },
    );
  }

  try {
    const listings = await getAvailableListings(parsedFilters.data);
    return NextResponse.json({ listings });
  } catch (error) {
    console.error("Public listing search failed.", error);
    return NextResponse.json(
      { error: "Listings are temporarily unavailable." },
      { status: 503 },
    );
  }
}
