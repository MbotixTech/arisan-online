import { getWinners } from "@/app/actions";
import WinnerList from "@/components/WinnerList";

export default async function WinnersPage() {
  const winners = await getWinners();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Winners</h1>
        <p className="text-slate-400">History of arisan winners.</p>
      </div>
      
      <WinnerList winners={winners} />
    </div>
  );
}
