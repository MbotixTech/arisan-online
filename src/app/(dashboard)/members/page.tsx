import { getMembers } from "@/app/actions";
import MemberTable from "@/components/MemberTable";

export default async function MembersPage() {
  const members = await getMembers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Members</h1>
        <p className="text-slate-400">Manage your arisan members here.</p>
      </div>
      
      <MemberTable initialMembers={members} />
    </div>
  );
}
