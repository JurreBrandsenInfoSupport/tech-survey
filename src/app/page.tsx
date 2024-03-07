import { unstable_noStore as noStore } from "next/cache";
import { getServerAuthSession } from "~/server/auth";
import { Login } from "./_components/login";

export default async function Home() {
  noStore();
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-500 to-gray-900 text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
          <span className="text-infoSupport">InfoSupport</span> Tech Survey
        </h1>
        <div className="max-w-2xl text-center">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. An nisi
            populari fama? An est aliquid per se ipsum flagitiosum, etiamsi
            nulla comitetur infamia?{" "}
            <i>
              Quid turpius quam sapientis vitam ex insipientium sermone pendere?
            </i>{" "}
            Sextilio Rufo, cum is rem ad amicos ita deferret, se esse heredem Q.
            Duo Reges: constructio interrete. Non quaeritur autem quid naturae
            tuae consentaneum sit, sed quid disciplinae. Mene ergo et Triarium
            dignos existimas, apud quos turpiter loquare? Scio enim esse
            quosdam, qui quavis lingua philosophari possint;{" "}
          </p>

          <p>
            Roges enim Aristonem, bonane ei videantur haec: vacuitas doloris,
            divitiae, valitudo; Videamus animi partes, quarum est conspectus
            illustrior; Idemne potest esse dies saepius, qui semel fuit? Nihil
            ad rem! Ne sit sane; <b>Laboro autem non sine causa;</b> Quod autem
            satis est, eo quicquid accessit, nimium est; Vitae autem degendae
            ratio maxime quidem illis placuit quieta.{" "}
            <b>Idemne, quod iucunde?</b> Neque enim disputari sine reprehensione
            nec cum iracundia aut pertinacia recte disputari potest.{" "}
            <i>Illud non continuo, ut aeque incontentae.</i>{" "}
          </p>
        </div>
        <Login session={session} />
      </div>
    </main>
  );
}
