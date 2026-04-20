import BookingClient from "@/components/booking/BookingClient";
import { Suspense } from "react";

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-10">Loading booking form...</div>}>
      <BookingClient />
    </Suspense>
  );
}
