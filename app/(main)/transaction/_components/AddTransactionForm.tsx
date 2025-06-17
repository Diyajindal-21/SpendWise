
"use client"

import { createTransaction, updateTransaction } from "@/actions/transaction"
import CreateAccountDrawer from "@/components/CreateAccountDrawer"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import useFetch from "@/hooks/use-fetch"
import { transactionSchema } from "@/lib/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { AlertCircle, CalculatorIcon, Loader2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import {  useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import ReceiptScanner from "./ReceiptScanner"

const AddTransactionForm = ({
  accounts,
  categories,
  editMode = false,
  initialData = null
}: {
  accounts: Array<{id: string, name: string, balance: string, isDefault?: boolean}>,
  categories: any,
  editMode?: boolean,
  initialData?: any
}) => {
    const router=useRouter();
    const searchParams=useSearchParams();
    const editId=searchParams.get("edit");
    const {register,setValue,handleSubmit,formState:{errors},watch,getValues,reset}=useForm({
        resolver:zodResolver(transactionSchema),
        defaultValues:
        editMode && initialData?{
          type:initialData.type,
          amount:initialData.amount.toString(),
          description:initialData.description,
          accountId:initialData.accountId,
          category:initialData.category,
          date:new Date(initialData.date),
          isRecurring:initialData.isRecurring,
          ...(initialData.recurringInterval && {recurringInterval:initialData.recurringInterval})
        }:
        {
            type:"EXPENSE",
            amount:"",
            description:"",
            accountId:accounts.find((ac)=>ac.isDefault)?.id,
            date:new Date(),
            isRecurring:false,
        }
    })
    const {
        loading:transactionLoading,
        fn:transactionFn,
        data:transactionResult,
    }=useFetch(editMode?updateTransaction: createTransaction);
    const type=watch("type");
    const isRecurring=watch("isRecurring");
    const date=watch("date");
    const filteredCategories=categories.filter(
        (category: { type: string })=>category.type===type
    )
    const onSubmit=async(data: { amount: string })=>{
        const formData={
            ...data,
            amount:parseFloat(data.amount)
        };
        if(editMode){
          transactionFn(editId,formData);
        }else{
          transactionFn(formData);
        }
        
    }
    useEffect(()=>{
        if(transactionResult?.success && !transactionLoading){
            toast.success(
              editMode?
              "Transaction updated successfully":
              "Transaction created successfully");
            reset();
            router.push(`/account/${transactionResult.data.accountId}`);
        }
    },[transactionResult,transactionLoading,editMode])
    const handleScanComplete=(scannedData: any)=>{
        if(scannedData){
            setValue("amount",scannedData.amount.toString());
            setValue("date",new Date(scannedData.date));
            if(scannedData.description){
                setValue("description",scannedData.description);
            }
            if(scannedData.category){
                setValue("category",scannedData.category);
            }
        }
    }
return(
  <form className="space-y-6 w-full" onSubmit={handleSubmit(onSubmit)}>
  {/* AI Receipt Scanner */}
  {!editMode && <ReceiptScanner onScanComplete={handleScanComplete} />}

  <div className="space-y-4">
    {/* Type Selector */}
    <div className="space-y-3">
      <label className="text-sm font-medium text-[#b0b3c7]">Type</label>
      <Select onValueChange={(value: "INCOME" | "EXPENSE") => setValue("type", value)} defaultValue={type}>
        <SelectTrigger className="bg-[#23234a] border border-white/10 rounded-lg text-white hover:bg-[#2a2a40]">
          <SelectValue placeholder="Select Type" />
        </SelectTrigger>
        <SelectContent className="bg-[#23234a] border border-white/10 text-white rounded-lg">
          <SelectItem value="EXPENSE" className="hover:bg-[#2a2a40]">Expense</SelectItem>
          <SelectItem value="INCOME" className="hover:bg-[#2a2a40]">Income</SelectItem>
        </SelectContent>
      </Select>
      {errors.type && <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle size={14} /> {errors.type?.message?.toString()}</p>}
    </div>

    {/* Amount & Account Grid */}
    <div className="grid gap-6 md:grid-cols-2">
      {/* Amount Input */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-[#b0b3c7]">Amount</label>
        <Input 
          type="number" 
          step="0.01" 
          placeholder="0.00" 
          {...register("amount")}
          className="w-full bg-[#23234a] border border-white/10 text-white placeholder-[#6b6d8f] focus:ring-2 focus:ring-[#5f5fff] rounded-lg pr-10"
        />
        {errors.amount && <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle size={14} /> {errors.amount?.message?.toString()}</p>}
      </div>

      {/* Account Selector */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-[#b0b3c7]">Account</label>
        <Select onValueChange={(value) => setValue("accountId", value)} defaultValue={getValues("accountId")}>
          <SelectTrigger className="bg-[#23234a] border border-white/10 rounded-lg text-white hover:bg-[#2a2a40]">
            <SelectValue placeholder="Select Account" />
          </SelectTrigger>
          <SelectContent className="bg-[#23234a] border border-white/10 text-white rounded-lg">
            {accounts.map((account) => (
              <SelectItem key={account.id} value={account.id} className="hover:bg-[#2a2a40]">
                {account.name} (${parseFloat(account.balance).toFixed(2)})
              </SelectItem>
            ))}
            <CreateAccountDrawer>
              <Button variant="ghost" className="w-full text-[#b0b3c7] hover:text-white hover:bg-[#2a2a40]">
                Create Account
              </Button>
            </CreateAccountDrawer>
          </SelectContent>
        </Select>
        {errors.accountId && <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle size={14} /> {errors.accountId.message?.toString()}</p>}
      </div>
    </div>

    {/* Category Selector */}
    <div className="space-y-3">
      <label className="text-sm font-medium text-[#b0b3c7]">Category</label>
      <Select onValueChange={(value) => setValue("category", value)} defaultValue={getValues("category")}>
        <SelectTrigger className="bg-[#23234a] border border-white/10 rounded-lg text-white hover:bg-[#2a2a40]">
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent className="bg-[#23234a] border border-white/10 text-white rounded-lg">
          {filteredCategories.map((category: any) => (
            <SelectItem key={category.id?.toString()} value={category.id?.toString() || ''} className="hover:bg-[#2a2a40]">
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.category && <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle size={14} /> {errors.category.message?.toString()}</p>}
    </div>

    {/* Date Picker */}
    <div className="space-y-2">
<label className="text-sm font-medium text-[#b0b3c7]">Date</label>
<Popover>
<PopoverTrigger asChild>
<Button variant="outline" className="w-full bg-[#23234a] border border-white/10 text-white placeholder-[#6b6d8f] focus:ring-2 focus:ring-[#5f5fff] hover:bg-[#2a2a40]">
{date?format(date,"PPP"):<span>Pick a date</span>}
<CalculatorIcon className="ml-auto h-4 w-4 opacity-50"></CalculatorIcon>
</Button>
</PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
<Calendar mode="single" selected={date}
onSelect={(date: Date | undefined) => date && setValue("date", date)}
disabled={(date: Date) => date > new Date() || date < new Date("1900-01-01")}
initialFocus
></Calendar>
</PopoverContent>
</Popover>
{errors.date && (
<p className="text-red-500 text-sm">{errors.date.message?.toString()}</p>
)}
</div>

    {/* Description Input */}
    <div className="space-y-3">
      <label className="text-sm font-medium text-[#b0b3c7]">Description</label>
      <Input
        type="text"
        placeholder="Enter Description"
        {...register("description")}
        className="bg-[#23234a] border border-white/10 text-white placeholder-[#6b6d8f] focus:ring-2 focus:ring-[#5f5fff]"
      />
      {errors.description && <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle size={14} /> {errors.description.message?.toString()}</p>}
    </div>

    {/* Recurring Transaction */}
    <div className="flex items-center justify-between rounded-xl p-4 bg-[#23234a]/60 border border-white/10">
      <div className="space-y-1">
        <label className="text-sm font-medium text-white cursor-pointer">Recurring Transaction</label>
        <p className="text-sm text-[#b0b3c7]">Set up a recurring schedule for this transaction</p>
      </div>
      <Switch
        checked={isRecurring}
        onCheckedChange={(checked) => setValue("isRecurring", checked)}
        className="data-[state=checked]:bg-[#5f5fff]"
      />
    </div>

    {/* Recurring Interval Selector */}
    {isRecurring && (
      <div className="space-y-3">
        <label className="text-sm font-medium text-[#b0b3c7]">Recurring Interval</label>
        <Select onValueChange={(value: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY") => setValue("recurringInterval", value)} defaultValue={getValues("recurringInterval")}>
          <SelectTrigger className="bg-[#23234a] border border-white/10 rounded-lg text-white hover:bg-[#2a2a40]">
            <SelectValue placeholder="Select Interval" />
          </SelectTrigger>
          <SelectContent className="bg-[#23234a] border border-white/10 text-white rounded-lg">
            <SelectItem value="DAILY" className="hover:bg-[#2a2a40]">Daily</SelectItem>
            <SelectItem value="WEEKLY" className="hover:bg-[#2a2a40]">Weekly</SelectItem>
            <SelectItem value="MONTHLY" className="hover:bg-[#2a2a40]">Monthly</SelectItem>
            <SelectItem value="YEARLY" className="hover:bg-[#2a2a40]">Yearly</SelectItem>
          </SelectContent>
        </Select>
        {errors.recurringInterval && <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle size={14} /> {errors.recurringInterval.message?.toString()}</p>}
      </div>
    )}

    {/* Action Buttons */}
    <div className="flex justify-end gap-4 mt-8">
  <Button
    type="button"
    variant="outline"
    className="px-8 py-2 rounded-full border border-white/30 text-white font-medium bg-transparent hover:bg-white/10 transition"
    onClick={() => router.back()}
  >
    Cancel
  </Button>
  <Button
    type="submit"
    className="px-8 py-2 rounded-full bg-gradient-to-r from-[#5f5fff] to-[#38bdf8] text-white font-semibold shadow-md hover:from-[#38bdf8] hover:to-[#5f5fff] transition"
    disabled={transactionLoading}
  >
    {editMode ? "Update Transaction" : "Create Transaction"}
  </Button>
</div>

  </div>
</form>

)
}
export default AddTransactionForm