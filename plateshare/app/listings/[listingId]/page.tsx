import { connection } from "next/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

import {
  getAvailableListing,
  getCategoryLabel,
} from "@/lib/listings";

type ListingPageProps = {
  params: Promise<{ listingId: string }>;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default function ListingPage({ params }: ListingPageProps) {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10 sm:px-8 sm:py-14">
      <Suspense fallback={<DetailLoading />}>
        <ListingDetails params={params} />
      </Suspense>
    </main>
  );
}

async function ListingDetails({ params }: ListingPageProps) {
  const { listingId } = await params;
  await connection();
  const listing = await getAvailableListing(listingId);

  if (!listing) {
    notFound();
  }

  return (
    <article className="overflow-hidden rounded-[2rem] border border-emerald-950/10 bg-white shadow-sm">
      <div className="bg-emerald-950 px-6 py-8 text-white sm:px-10 sm:py-10">
        <Link
          className="text-sm font-semibold text-emerald-100 underline underline-offset-4 hover:text-white"
          href="/"
        >
          Back to available food
        </Link>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-100">
            {getCategoryLabel(listing.category)}
          </span>
          <span className="rounded-full bg-emerald-300/15 px-3 py-1 text-xs font-semibold text-emerald-100">
            Available
          </span>
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          {listing.title}
        </h1>
        <p className="mt-3 text-emerald-100">
          {listing.quantity} available
        </p>
      </div>

      <div className="grid gap-8 px-6 py-8 sm:px-10 sm:py-10 md:grid-cols-[1fr_0.8fr]">
        <section>
          <h2 className="text-lg font-semibold text-slate-950">About this food</h2>
          <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-700">
            {listing.description}
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-950">
                Food information
              </h3>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {listing.foodDetails || "No additional food information provided."}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-950">
                Allergens
              </h3>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {listing.allergenInfo || "No allergen information provided."}
              </p>
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-2xl bg-[#f6f7f1] p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-950">Pickup window</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Starts{" "}
            <span className="font-semibold">
              {dateFormatter.format(listing.pickupStartsAt)}
            </span>
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-700">
            Ends{" "}
            <span className="font-semibold">
              {dateFormatter.format(listing.pickupEndsAt)}
            </span>
          </p>
          <div className="mt-6 border-t border-slate-200 pt-5">
            <h3 className="text-sm font-semibold text-slate-950">
              Pickup details are private
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The pickup address and handoff instructions are shared only with
              the listing owner and the member whose claim succeeds.
            </p>
          </div>
        </aside>
      </div>
    </article>
  );
}

function DetailLoading() {
  return (
    <div aria-label="Loading listing details" className="animate-pulse" role="status">
      <span className="sr-only">Loading listing details…</span>
      <div className="h-56 rounded-[2rem] bg-slate-200" />
      <div className="mt-6 h-64 rounded-[2rem] bg-slate-200" />
    </div>
  );
}
