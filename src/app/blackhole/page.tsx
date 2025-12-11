import dynamic from 'next/dynamic';

const BlackHoleScene = dynamic(() => import('../../components/universe/BlackHoleScene'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-screen bg-black flex items-center justify-center text-white font-mono text-sm uppercase tracking-widest">
            Initializing Singularity...
        </div>
    )
});

export default function BlackHolePage() {
    return (
        <main className="w-full h-screen bg-black">
            <BlackHoleScene />
        </main>
    );
}
