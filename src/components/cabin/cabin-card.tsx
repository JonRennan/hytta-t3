import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Cabin } from "~/types";
import Image from "next/image";

interface CabinCardProps {
  cabin: Cabin;
}

export default function CabinCard({ cabin }: CabinCardProps) {
  return (
    <div
      className="flex w-full max-w-sm flex-col items-center gap-1 rounded bg-surface-container p-4"
      key={cabin.id}
    >
      {cabin.imageLink && (
        <Image
          src={cabin.imageLink}
          width={256}
          height={150}
          alt={cabin.name ? cabin.name : "Hytta"}
          className="rounded"
        />
      )}
      <h1 className="text-2xl font-bold uppercase">{cabin.name}</h1>
      <p>{cabin.description}</p>
      {cabin.gmapsLink ? (
        <Button variant="link" className="max-w-64">
          <Link href={cabin.gmapsLink} target="_blank">
            {cabin.address}
          </Link>
        </Button>
      ) : (
        <p>{cabin.address}</p>
      )}
      <Button variant="link">
        <Link href={`/kalender/${cabin.id}`}>Se kalender -{">"}</Link>{" "}
      </Button>
    </div>
  );
}
