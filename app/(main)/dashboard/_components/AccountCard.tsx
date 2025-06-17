"use client";
import { updateDefaultAccount } from "@/actions/accounts";
import { Card,CardHeader,CardTitle,CardAction,CardContent,CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import useFetch from "@/hooks/use-fetch";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";
const AccountCard = ({account}: {account: {name: string; type: string; balance: string; id: string; isDefault: boolean}}) => {
    const {name,type,balance,id,isDefault}=account;
    const {
        loading:updateDefaultLoading,
        fn:updateDefaultFn,
        data:updatedAccount,
        error
    }=useFetch(updateDefaultAccount);
    const handleDefaultChange=async(event: { preventDefault: () => void; })=>{
        event?.preventDefault();
        if(isDefault){
            toast.warning("You need to atleast 1 default account");
            return;
        }
        await updateDefaultFn(id);
    }
    useEffect(()=>{
        if(updatedAccount){
            toast.success("Default Account updated successfully");
        }
    },[updatedAccount,updateDefaultLoading]);
    useEffect(()=>{
        if(error){
            toast.error(error.message||"Failed to update default account");
        }
    },[error]);
    return (
        <Card className="group relative bg-gradient-to-br from-[#23234a]/80 to-[#181830]/90 border border-white/10 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow backdrop-blur-md">
  <Link href={`/account/${id}`} className="block p-0">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-3">
      <CardTitle className="text-base font-semibold capitalize text-white">{name}</CardTitle>
      <Switch checked={isDefault} onClick={handleDefaultChange} disabled={updateDefaultLoading} />
    </CardHeader>
    <CardContent className="px-4 pb-3">
      <div className="text-xl font-bold text-white">
        ${parseFloat(balance).toFixed(2)}
      </div>
      <p className="py-1 text-md text-[#b0b3c7] font-medium">
        {type.charAt(0) + type.slice(1).toLocaleLowerCase()} Account
      </p>
    </CardContent>
    <CardFooter className="flex justify-between text-sm px-4 pb-4 text-[#b0b3c7]">
      <div className="flex items-center">
        <ArrowUpRight className="mr-1 h-4 w-4 text-green-400" />
        Income
      </div>
      <div className="flex items-center">
        <ArrowDownRight className="mr-1 h-4 w-4 text-rose-400" />
        Expense
      </div>
    </CardFooter>
  </Link>
</Card>

    )
}
export default AccountCard