// app/status/[token]/page.tsx

import { notFound } from "next/navigation";

import { supabaseService } from "@/lib/supabase";



type StatusPageProps = {

  params: { token: string };

  searchParams: { success?: string; canceled?: string };

};



function getSignatureInfo(

  requiresSignature: boolean,

  itemValueCents: number | null

) {

  if (!requiresSignature) {

    return {

      label: "No signature required",

      description:

        "Based on the latest information, this shipment does not require a direct signature.",

    };

  }



  if (itemValueCents !== null && itemValueCents >= 50000) {

    return {

      label: "Signature required (high-value shipment)",

      description:

        "This package meets the merchant's high-value threshold and is treated as signature required for added protection.",

    };

  }



  return {

    label: "Signature required",

    description:

      "The carrier or merchant has marked this shipment as requiring a signature at delivery.",

  };

}



export default async function StatusPage({ params, searchParams }: StatusPageProps) {

  const token = params.token;

  const isSuccess = searchParams?.success === "true";

  const isCanceled = searchParams?.canceled === "true";



  const { data: shipment, error } = await supabaseService

    .from("shipments")

    .select(

      `

      id,

      buyer_name,

      tracking_number,

      carrier,

      carrier_status,

      requires_signature,

      override_locked,

      override_status,

      item_value_cents

    `

    )

    .eq("buyer_status_token", token)

    .maybeSingle();



  if (error) {

    console.error("[status page] Error loading shipment", error);

    throw new Error("Failed to load shipment status");

  }



  if (!shipment) {

    notFound();

  }



  const {

    buyer_name,

    tracking_number,

    carrier,

    carrier_status,

    requires_signature,

    override_locked,

    override_status,

    item_value_cents,

  } = shipment;



  const sigInfo = getSignatureInfo(

    requires_signature,

    item_value_cents ?? null

  );



  const canOverride =

    requires_signature === true &&

    override_locked === false &&

    override_status === "none";



  return (

    <main className="min-h-screen bg-slate-50 flex justify-center px-4 py-10">

      <div className="w-full max-w-xl bg-white shadow-sm rounded-xl border border-slate-200 p-6 space-y-6">

        {isSuccess && (

          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">

            <div className="flex items-start gap-3">

              <div className="flex-shrink-0">

                <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">

                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />

                </svg>

              </div>

              <div className="flex-1">

                <h3 className="text-sm font-semibold text-green-900">Payment Successful!</h3>

                <p className="mt-1 text-sm text-green-800">

                  Your signature release authorization has been processed. You&apos;ll receive a confirmation email shortly, and the carrier will be notified to leave your package without requiring a signature.

                </p>

              </div>

            </div>

          </div>

        )}



        {isCanceled && (

          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">

            <div className="flex items-start gap-3">

              <div className="flex-shrink-0">

                <svg className="h-5 w-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">

                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />

                </svg>

              </div>

              <div className="flex-1">

                <h3 className="text-sm font-semibold text-amber-900">Payment Canceled</h3>

                <p className="mt-1 text-sm text-amber-800">

                  Your payment was canceled. You can try again when you&apos;re ready. The authorization form is still available below.

                </p>

              </div>

            </div>

          </div>

        )}



        <header className="space-y-1">

          <p className="text-sm text-slate-500">Delivery status for</p>

          <h1 className="text-xl font-semibold text-slate-900">

            {buyer_name || "Your package"}

          </h1>

        </header>



        <section className="space-y-2">

          <h2 className="text-sm font-medium text-slate-700">

            Shipment details

          </h2>

          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm space-y-1">

            <p>

              <span className="font-medium">Tracking #:</span>{" "}

              {tracking_number || "—"}

            </p>

            <p>

              <span className="font-medium">Carrier:</span>{" "}

              {carrier || "—"}

            </p>

            <p>

              <span className="font-medium">Carrier status:</span>{" "}

              {carrier_status || "Unknown"}

            </p>

          </div>

        </section>



        <section className="space-y-2">

          <h2 className="text-sm font-medium text-slate-700">

            Signature requirement

          </h2>

          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm space-y-1">

            <p className="font-semibold text-amber-900">{sigInfo.label}</p>

            <p className="text-amber-900/80">{sigInfo.description}</p>

            {override_locked && (

              <p className="text-xs text-amber-900/70 mt-1">

                Delivery is already in progress or completed, so changes to the

                signature requirement are now locked.

              </p>

            )}

          </div>

        </section>



        {canOverride ? (

          <section className="space-y-3">

            <h2 className="text-sm font-medium text-slate-700">

              Authorize delivery release

            </h2>

            <p className="text-sm text-slate-600">

              If you won&apos;t be available to sign in person, you can

              authorize the carrier to leave your package for a one-time fee of{" "}

              <span className="font-semibold">$2.99</span>. You&apos;ll be

              asked to type your full name and complete a secure payment.

            </p>



            {/* This assumes you have /api/buyer/start implemented to:

                - Validate token

                - Store auth name + IP

                - Create Stripe Checkout Session

                - Redirect buyer to Stripe

            */}

            <form

              action="/api/buyer/start"

              method="POST"

              className="space-y-2"

            >

              <input type="hidden" name="token" value={token} />

              <label className="block text-sm text-slate-700">

                Full name for authorization

                <input

                  name="auth_name"

                  required

                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"

                  placeholder="Type your full name"

                />

              </label>

              <button

                type="submit"

                className="w-full mt-2 inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"

              >

                Authorize Delivery — $2.99

              </button>

            </form>

          </section>

        ) : (

          <section className="space-y-2">

            <p className="text-sm text-slate-500">

              There is currently no changeable signature authorization available

              for this shipment. It will be delivered according to the

              carrier&apos;s normal process.

            </p>

          </section>

        )}

      </div>

    </main>

  );

}
