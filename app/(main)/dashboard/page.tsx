import { getDashboardData, getUserAccounts } from "@/actions/dashboard";
import CreateAccountDrawer from "@/components/CreateAccountDrawer";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import AccountCard from "./_components/AccountCard";
import { getCurrentBudeget } from "@/actions/budget";
import BudgetProgress from "./_components/BudgetProgress";
import { Suspense } from "react";
import DashboardOverview from "./_components/DashboardOverview";

const Dashboard = async () => {
  const accounts = await getUserAccounts();
  const defaultAccount = accounts?.serializedAccount?.find((account) => account.isDefault);
  let budgetData = null;
  if (defaultAccount) {
    budgetData = await getCurrentBudeget(defaultAccount.id);
  }
  const transaction = await getDashboardData();

  return (
    <div className="min-h-screen w-full flex flex-col space-y-8 px-4 sm:px-6 md:px-10">
      {/* Budget Progress */}
      {defaultAccount && (
        <BudgetProgress
          initialBudget={budgetData?.budget || { amount: 0 }}
          currentExpenses={budgetData?.currentExpenses || 0}
        />
      )}

      {/* Dashboard Overview */}
      <Suspense fallback={"Loading Overview..."}>
        <DashboardOverview
          accounts={accounts?.serializedAccount || []}
          transactions={Array.isArray(transaction) ? transaction : []}
        />
      </Suspense>

      {/* Accounts Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
        <CreateAccountDrawer>
          <Card className="hover:shadow-2xl hover:scale-[1.03] hover:border-[#5f5fff]/40 transition-all duration-200 cursor-pointer border-dashed border-2 border-white/20 bg-gradient-to-br from-[#23234a]/70 to-[#181830]/80 rounded-2xl shadow-xl backdrop-blur-md">
            <CardContent className="flex flex-col items-center justify-center text-[#b0b3c7] h-full pt-8 pb-8 group">
              <Plus className="h-10 w-10 mb-2 text-[#5f5fff] group-hover:animate-bounce transition" />
              <p className="text-base font-semibold text-center">Add New Account</p>
            </CardContent>
          </Card>
      </CreateAccountDrawer>
      {accounts?.serializedAccount &&
        accounts.serializedAccount.length > 0 &&
        accounts.serializedAccount.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
    </div>
</div>

  )
}
export default Dashboard