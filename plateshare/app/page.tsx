import { connection } from "next/server";
import Link from "next/link";
import { Suspense } from "react";

import { ListingCard } from "@/components/listing-card";
import { getAvailableListings, parseBrowseFilters } from "@/lib/listings";

type HomePageProps = {
  searchParams: Promise<{
    q?: string | string[];
    category?: string | string[];
  }>;
};

export default function HomePage({ searchParams }: HomePageProps) {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
      <section className="overflow-hidden rounded-[2rem] bg-emerald-950 px-6 py-10 text-white sm:px-10 sm:py-14">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-200">
          A little good goes a long way
        </p>
        <div className="mt-4 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Good food deserves another place at the table.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-emerald-100 sm:text-lg">
              Discover surplus food shared by your community. Browse what is
              available and find a pickup window that works for you.
            </p>
          </div>
          <p className="max-w-48 text-sm leading-6 text-emerald-200">
            Free to browse. Pickup details stay private.
          </p>
        </div>
      </section>

      <section aria-labelledby="browse-title" className="mt-12">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-800">
              The community table
            </p>
            <h2
              className="mt-2 text-3xl font-semibold tracking-tight text-slate-950"
              id="browse-title"
            >
              Available food
            </h2>
          </div>
          <p className="text-sm text-slate-600">
            Only listings with an open pickup window are shown.
          </p>
        </div>

        <Suspense fallback={<BrowseLoading />}>
          <BrowseResults searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  );
}

async function BrowseResults({ searchParams }: HomePageProps) {
  const search = await searchParams;
  const parsed = parseBrowseFilters({
    q: first(search.q),
    category: first(search.category),
  });
  const filters = parsed.success ? parsed.data : {};

  await connection();
  const listings = await getAvailableListings(filters);
  const hasFilters = Boolean(filters.q || filters.category);

  return (
    <>
      <form
        action="/"
        className="mt-7 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[minmax(0,1fr)_220px_auto_auto] sm:items-end"
        method="get"
      >
        <div>
          <label
            className="mb-1.5 block text-sm font-semibold text-slate-800"
            htmlFor="search"
          >
            Search food
          </label>
          <input
            className="form-input"
            defaultValue={filters.q}
            id="search"
            maxLength={100}
            name="q"
            placeholder="Try bread, apples, or dairy-free"
            type="search"
          />
        </div>
        <div>
          <label
            className="mb-1.5 block text-sm font-semibold text-slate-800"
            htmlFor="category"
          >
            Category
          </label>
          <select
            className="form-input"
            defaultValue={filters.category ?? ""}
            id="category"
            name="category"
          >
            <option value="">All categories</option>
            <option value="PRODUCE">Produce</option>
            <option value="BAKERY">Bakery</option>
            <option value="DAIRY">Dairy</option>
            <option value="PANTRY">Pantry</option>
            <option value="PREPARED">Prepared food</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <button
          className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-900"
          type="submit"
        >
          Apply filters
        </button>
        {hasFilters ? (
          <Link
            className="rounded-xl px-4 py-3 text-center text-sm font-semibold text-emerald-900 underline underline-offset-4 hover:bg-emerald-50"
            href="/"
          >
            Clear filters
          </Link>
        ) : null}
      </form>

      {listings.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-dashed border-emerald-900/20 bg-white px-6 py-12 text-center">
          <h3 className="text-xl font-semibold text-slate-950">
            {hasFilters ? "No food matches those filters" : "The table is quiet for now"}
          </h3>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">
            {hasFilters
              ? "Try a different search or category to see more available food."
              : "There are no available listings at the moment. Please check back soon."}
          </p>
          {hasFilters ? (
            <Link
              className="mt-5 inline-flex rounded-full border border-emerald-900/20 px-5 py-2.5 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
              href="/"
            >
              Clear filters
            </Link>
          ) : null}
        </div>
      )}
    </>
  );
}

function first(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function BrowseLoading() {
  return (
    <div aria-label="Loading available food" className="mt-7" role="status">
      <span className="sr-only">Loading available food…</span>
      <div className="mb-6 h-24 animate-pulse rounded-2xl bg-slate-200" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            className="h-56 animate-pulse rounded-3xl bg-slate-200"
            key={item}
          />
        ))}
      </div>
    </div>
  );
}
