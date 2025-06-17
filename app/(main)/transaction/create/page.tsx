import { getUserAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/data/categories";
import AddTransactionForm from "../_components/AddTransactionForm";
import { getTransaction } from "@/actions/transaction";

const AddTransactions = async ({ searchParams }:{
    searchParams?: Promise<{ edit?: string }>;
  }) =>
{
    const accounts=await getUserAccounts();
    const editId=(await searchParams)?.edit;
    let initialData=null;
    if(editId){
        const transaction=await getTransaction(editId);
        initialData=transaction;
    }
    return(
        <div className="w-full min-h-screen px-5 md:px-8 py-8 bg-gradient-to-br from-[#181830] to-[#23234a] rounded-lg">
        <h1 className="text-4xl md:text-5xl bg-gradient-to-br from-[#5f5fff] to-[#38bdf8] font-extrabold tracking-tighter pr-2 pb-2 text-transparent bg-clip-text mb-10 ml-4 md:ml-0">
          {editId ? "Edit" : "Add"} transactions
        </h1>
        <div className="w-full max-w-5xl mx-auto">
          <AddTransactionForm 
            accounts={accounts.serializedAccount || []} 
            categories={defaultCategories}
            editMode={!!editId}
            initialData={initialData}
          />
        </div>
      </div>
      
    )
}
export default AddTransactions;