import { getServerAuthSession } from "~/server/auth";
import { Login } from "./_components/login";
import Link from "next/link";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-500 to-gray-900 text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
          <span className="text-infoSupport">InfoSupport</span> Tech Survey
        </h1>
        {!session && (
          <div className="max-w-2xl text-center">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. An nisi
              populari fama? An est aliquid per se ipsum flagitiosum, etiamsi
              nulla comitetur infamia?{" "}
              <i>
                Quid turpius quam sapientis vitam ex insipientium sermone
                pendere?
              </i>{" "}
              Sextilio Rufo, cum is rem ad amicos ita deferret, se esse heredem
              Q. Duo Reges: constructio interrete. Non quaeritur autem quid
              naturae tuae consentaneum sit, sed quid disciplinae. Mene ergo et
              Triarium dignos existimas, apud quos turpiter loquare? Scio enim
              esse quosdam, qui quavis lingua philosophari possint;{" "}
            </p>
          </div>
        )}

        {/* If the user is logged in, show the selectRoles compoennt */}
        {session && (
          <Link
            className="rounded-full bg-white/10 px-8 py-3 font-semibold transition hover:bg-white/20"
            href="/survey"
            passHref
          >
            Go to survey
          </Link>
        )}

        <Login session={session} />
      </div>
    </main>
  );
}
