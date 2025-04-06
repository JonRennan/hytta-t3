import CabinCard from "~/components/cabin/cabin-card";
import {getMyCabins} from "~/server/actions";
import {type Cabin} from "~/types";

export const dynamic = "force-dynamic";

export default async function Home() {
    const cabins: Cabin[] = await getMyCabins();
    return (
        <main className="m-auto w-full max-w-(--breakpoint-lg) p-4">
            <h1 className="text-primary text-center text-3xl font-bold">
                Dine hytter
            </h1>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
                {cabins.map((cabin) => (
                    <CabinCard cabin={cabin} key={cabin.id}/>
                ))}
            </div>
        </main>
    );
}
