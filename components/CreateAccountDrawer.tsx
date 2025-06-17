"use client"

import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { Drawer, DrawerTrigger,DrawerContent, DrawerHeader,DrawerTitle, DrawerClose, } from "./ui/drawer"
import {useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { accountSchema } from "@/lib/schema"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Switch } from "./ui/switch"
import useFetch from "@/hooks/use-fetch"
import { createAccount } from "@/actions/dashboard"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
const CreateAccountDrawer = ({children}: {children: React.ReactNode}) => {
    const [open,setOpen]=useState(false);
    const {register,handleSubmit,formState:{
        errors
    },setValue,watch,reset}=useForm({
        resolver:zodResolver(accountSchema),
        defaultValues:{
            name:"",
            type:"CURRENT",
            balance:"",
            isDefault:false,
        }
    });
    const {data:newAccount,error,fn:createAccountFn,loading:createAccountLoading}= useFetch(createAccount);
    useEffect(()=>{
        if(newAccount&&!createAccountLoading) {
            toast.success("Account created successfully");
            reset();
            setOpen(false);
        }
    },[createAccountLoading,newAccount]);
    useEffect(()=>{
        if(error) {
            toast.error(error.message||"Failed to create account");
        }
    },[error])
    const onSubmit = async (data: {
        name: string;
        type: "CURRENT" | "SAVINGS";
        balance: string;
        isDefault: boolean;
    }) => {
        console.log(data);
        await createAccountFn(data);
    }
    return (
        <Drawer open={open} onOpenChange={setOpen}>
  <DrawerTrigger asChild>{children}</DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle className="text-white text-lg px-2 ">Create New Account</DrawerTitle>
    </DrawerHeader>
    <div className="px-6 pb-6 pt-1">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Account Name */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-[#b0b3c7] py-2">Account Name</label>
          <Input
            id="name"
            placeholder="e.g., Main Checking"
            className="bg-[#23234a] border border-white/10 text-white placeholder-[#6b6d8f] focus:ring-2 focus:ring-[#5f5fff] rounded-lg"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-red-400 text-sm">{errors.name.message}</p>
          )}
        </div>
        {/* Account Type */}
        <div className="space-y-2">
          <label htmlFor="type" className="text-sm font-medium text-[#b0b3c7]">Account Type</label>
          <Select onValueChange={(value: "CURRENT" | "SAVINGS") => setValue("type", value)} defaultValue={watch("type")}>
            <SelectTrigger id="type" className="bg-[#23234a] border border-white/10 text-white rounded-lg">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent className="bg-[#23234a] border border-white/10 text-white rounded-lg">
              <SelectItem value="CURRENT" className="hover:bg-[#2a2a40]">Current</SelectItem>
              <SelectItem value="SAVINGS" className="hover:bg-[#2a2a40]">Savings</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && (
            <p className="text-red-400 text-sm">{errors.type.message}</p>
          )}
        </div>
        {/* Initial Balance */}
        <div className="space-y-2">
          <label htmlFor="balance" className="text-sm font-medium text-[#b0b3c7]">Initial Balance</label>
          <Input
            id="balance"
            type="number"
            placeholder="0.00"
            step="0.01"
            className="bg-[#23234a] border border-white/10 text-white placeholder-[#6b6d8f] focus:ring-2 focus:ring-[#5f5fff] rounded-lg"
            {...register("balance")}
          />
          {errors.balance && (
            <p className="text-red-400 text-sm">{errors.balance.message}</p>
          )}
        </div>
        {/* Set as Default */}
        <div className="flex items-center justify-between rounded-xl bg-[#23234a]/60 border border-white/10 p-4">
          <div className="space-y-1">
            <label htmlFor="isDefault" className="text-sm font-medium text-white cursor-pointer">Set as Default</label>
            <p className="text-sm text-[#b0b3c7]">This account will be selected by default for transactions</p>
          </div>
          <Switch
            id="isDefault"
            onCheckedChange={(checked) => setValue("isDefault", checked)}
            checked={watch("isDefault")}
            className="data-[state=checked]:bg-[#5f5fff]"
          />
        </div>
        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <DrawerClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="flex-1 border border-white/20 text-[#b0b3c7] font-semibold rounded-xl bg-[#23234a]/70 hover:bg-[#23234a] hover:text-white hover:border-[#5f5fff] transition-all duration-150"
              disabled={createAccountLoading}
            >
              Cancel
            </Button>
          </DrawerClose>
          <Button
            type="submit"
            className="flex-1 bg-gradient-to-r from-[#5f5fff] to-[#38bdf8] text-white font-semibold rounded-xl shadow-md hover:from-[#38bdf8] hover:to-[#5f5fff] transition-all"
            disabled={createAccountLoading}
          >
            {createAccountLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </div>
      </form>
    </div>
  </DrawerContent>
</Drawer>

    )
}
export default CreateAccountDrawer