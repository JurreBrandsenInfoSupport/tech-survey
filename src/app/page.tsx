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
          <span className="text-custom-primary">InfoSupport</span> Tech Survey
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
              <Button className="bg-custom-buttonPrimary dark:bg-custom-buttonPrimary text-custom-secondary hover:bg-custom-buttonHover">
                Go to survey
                <svg
                  className="arrow-right ml-2"
                  width="10"
                  height="10"
                  viewBox="0 0 4 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    id="Vector"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M2.39352 3.60724H3.60801V2.39278H2.39352V3.60724Z"
                    fill="#003865"
                  ></path>
                  <path
                    id="Vector_2"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M1.19662 4.80365H2.41102V3.58923H1.19662V4.80365Z"
                    fill="#003865"
                  ></path>
                  <path
                    id="Vector_3"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M1.19662 2.41089H2.41102V1.19641H1.19662V2.41089Z"
                    fill="#003865"
                  ></path>
                  <path
                    id="Vector_4"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0 6H1.21442V4.78559L0 4.78558L0 6Z"
                    fill="#003865"
                  ></path>
                  <path
                    id="Vector_5"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0 1.21448H1.21442V9.50098e-05L0 -5.24521e-06L0 1.21448Z"
                    fill="#003865"
                  ></path>
                </svg>
              </Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};
export default Home;
