import { getServerAuthSession } from "~/server/auth";
import { Login } from "./_components/login";

import Link from "next/link";
import SelectRole from "./_components/select-role";
import { ModeToggle } from "./_components/mode-toggle";
import { api } from "~/trpc/server";

const Home: React.FC = async () => {
  const session = await getServerAuthSession();
  const roles = await api.survey.getRoles.query();

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="absolute right-4 top-4 z-50">
        <ModeToggle />
      </div>
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
          <div>
            <SelectRole session={session} roles={roles} />
            <Link
              className="rounded-full bg-white/10 px-8 py-3 font-semibold transition hover:bg-white/20"
              href="/survey"
              passHref
            >
              Go to survey
            </Link>
          </div>
        )}

        <Login session={session} />
      </div>
    </main>
  );
};
export default Home;
