import { getPayments, getMembers, getArisanPeriods } from "@/app/actions";
import PaymentTable from "@/components/PaymentTable";

export default async function PaymentsPage() {
  const [payments, members, arisanPeriods] = await Promise.all([
    getPayments(),
    getMembers(),
    getArisanPeriods(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Payments</h1>
        <p className="text-slate-400">Track member payments.</p>
      </div>
      
      <PaymentTable 
        initialPayments={payments} 
        members={members} 
        arisanPeriods={arisanPeriods} 
      />
    </div>
  );
}
