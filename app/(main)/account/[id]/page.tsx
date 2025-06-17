import { getAccountWithTransactions } from "@/actions/accounts";
import { notFound } from "next/navigation";
import { JSX, Suspense } from "react";
import TransactionTable from "../_components/TransactionTable";
import BarLoader from "react-spinners/BarLoader";
import AccountChart from "../_components/AccountChart";
interface PageProps {
    params: { id: string }
  }
  const AccountsPage = async (props: PageProps) => {
    const { params } = props;
    const id = params.id; {
  const id = params.id;
  const accountData = await getAccountWithTransactions(id);

  if (!accountData) {
    notFound();
  }

  const { transactions, ...account } = accountData;

  return (
    <div className="space-y-8 px-5">
      <div className="flex gap-4 items-end justify-between">
        <div>
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 font-extrabold tracking-tighter pr-2 pb-2 text-transparent bg-clip-text capitalize">
            {account.name}
          </h1>
          <p className="text-lg text-muted-foreground">
            {account.type.charAt(0) + account.type.slice(1).toLowerCase()}
          </p>
        </div>
        <div className="text-right pb-2">
          <div className="text-xl sm:text-2xl font-bold">
            ${parseFloat(account.balance).toFixed(2)}
          </div>
          <p className="text-md text-muted-foreground">
            {account._count.transactions} Transactions
          </p>
        </div>
      </div>

      <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}>
        <AccountChart transactions={transactions} />
      </Suspense>

      <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}>
        <TransactionTable transactions={transactions} />
      </Suspense>
    </div>
  );
}}
export default AccountsPage as unknown as (props: any) => Promise<JSX.Element>;
