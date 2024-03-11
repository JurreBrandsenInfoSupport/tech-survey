import { getServerAuthSession } from "~/server/auth";
import { Login } from "./_components/login";

import Link from "next/link";
import SelectRole from "./_components/select-role";
import { ModeToggle } from "./_components/mode-toggle";
import { api } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import { type Role } from "~/models/types";

const Home: React.FC = async () => {
  const session = await getServerAuthSession();

  const rolesPromise = api.survey.getRoles.query();
  let userSelectedRolesPromise: Promise<Role[]> = Promise.resolve([]);

  if (session && session.user) {
    userSelectedRolesPromise = api.survey.getUserSelectedRoles.query({
      userId: session.user.id,
    });
  }

  const [roles, userSelectedRoles] = await Promise.all([
    rolesPromise,
    userSelectedRolesPromise,
  ]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="absolute right-4 top-4 z-50 flex items-center space-x-4">
        {session && <Login session={session} />}
        <ModeToggle />
      </div>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
          <span className="text-infoSupport">InfoSupport</span> Tech Survey
        </h1>
        {!session && (
          <div>
            <div className="max-w-2xl text-center">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. An nisi
                populari fama? An est aliquid per se ipsum flagitiosum, etiamsi
                nulla comitetur infamia?{" "}
                <i>
                  Quid turpius quam sapientis vitam ex insipientium sermone
                  pendere?
                </i>{" "}
                Sextilio Rufo, cum is rem ad amicos ita deferret, se esse
                heredem Q. Duo Reges: constructio interrete. Non quaeritur autem
                quid naturae tuae consentaneum sit, sed quid disciplinae. Mene
                ergo et Triarium dignos existimas, apud quos turpiter loquare?
                Scio enim esse quosdam, qui quavis lingua philosophari possint;{" "}
              </p>
            </div>
            <Login session={session} />
          </div>
        )}

        {/* If the user is logged in, show the selectRoles compoennt */}
        {session && (
          <div>
            <SelectRole
              session={session}
              roles={roles}
              userSelectedRoles={userSelectedRoles}
            />
            <Link href="/survey/general" passHref>
              <Button>{">"} Go to survey</Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};
export default Home;
