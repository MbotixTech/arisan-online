import { getArisanPeriods } from "@/app/actions";
import ArisanList from "@/components/ArisanList";

export default async function ArisanPage() {
  const periods = await getArisanPeriods();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Arisan Periods</h1>
        <p className="text-slate-400">Manage active and past arisan periods.</p>
      </div>
      
      <ArisanList initialPeriods={periods} />
    </div>
  );
}
