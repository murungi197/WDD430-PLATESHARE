import Link from "next/link";

import { getCategoryLabel } from "@/lib/listings";

type ListingCardProps = {
  listing: {
    id: string;
    title: string;
    category: Parameters<typeof getCategoryLabel>[0];
    quantity: string;
    pickupStartsAt: Date;
    pickupEndsAt: Date;
  };
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <article className="listing-card">
      <div className="flex items-start justify-between gap-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">
          {getCategoryLabel(listing.category)}
        </p>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900">
          Available
        </span>
      </div>
      <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">
        <Link
          className="decoration-emerald-700 decoration-2 underline-offset-4 hover:underline"
          href={`/listings/${listing.id}`}
        >
          {listing.title}
        </Link>
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        <span className="font-semibold text-slate-800">Quantity:</span>{" "}
        {listing.quantity}
      </p>
      <p className="mt-4 text-sm leading-6 text-slate-600">
        Pickup window
        <br />
        <span className="font-medium text-slate-800">
          {dateFormatter.format(listing.pickupStartsAt)}
          {" – "}
          {dateFormatter.format(listing.pickupEndsAt)}
        </span>
      </p>
      <Link
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950"
        href={`/listings/${listing.id}`}
      >
        View food details <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
