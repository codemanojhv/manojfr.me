import dynamic from "next/dynamic";

const UniverseScene = dynamic(() => import("@/components/universe/UniverseScene"), {
    ssr: false,
    loading: () => <div className="w-full h-screen bg-black text-white flex items-center justify-center">Loading Universe...</div>
});

export const metadata = {
    title: "Universe Simulation | Manoj",
    description: "A 3D simulation of the cosmos.",
};

export default function UniversePage() {
    return (
        <main className="w-full h-screen overflow-hidden">
            <UniverseScene />
        </main>
    );
}
