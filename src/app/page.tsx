import CabinCard from "~/components/cabin/cabin-card";
import { Cabin } from "~/types";
import { getCabins } from "~/server/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const cabins: Cabin[] = await getCabins();
  return (
    <main className="m-auto w-full max-w-screen-lg p-4">
      <h1 className="text-center text-3xl font-bold text-primary">
        Dine hytter
      </h1>
      <div className="mt-4 flex flex-wrap gap-4">
        {cabins.map((cabin) => (
          <CabinCard cabin={cabin} />
        ))}
      </div>
    </main>
  );
}
