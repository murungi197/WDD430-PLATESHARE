import { NextResponse } from "next/server";

import { getAvailableListing } from "@/lib/listings";

export async function GET(
  _request: Request,
  context: { params: Promise<{ listingId: string }> },
) {
  const { listingId } = await context.params;

  try {
    const listing = await getAvailableListing(listingId);

    if (!listing) {
      return NextResponse.json(
        { error: "This listing is not available." },
        { status: 404 },
      );
    }

    return NextResponse.json({ listing });
  } catch (error) {
    console.error("Public listing detail lookup failed.", error);
    return NextResponse.json(
      { error: "Listing details are temporarily unavailable." },
      { status: 503 },
    );
  }
}
