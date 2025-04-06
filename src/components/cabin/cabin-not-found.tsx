interface CabinNotFoundProps {
    cabinId: number;
}

export function CabinNotFound({cabinId}: CabinNotFoundProps) {
    return (
        <p className="text-surface-on_v bg-surface-container_low mx-auto mt-8 w-fit rounded p-4 text-center text-2xl">
            Fant ikke hytte {cabinId}, eller så har du ikke tilgang til hytta.
        </p>
    );
}
