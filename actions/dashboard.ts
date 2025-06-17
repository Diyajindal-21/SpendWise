"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
const serializeTransaction=(obj: any)=>{
    const serialized={...obj};
    if(obj.balance){
        serialized.balance=obj.balance.toNumber();
    }
    if(obj.amount){
        serialized.amount=obj.amount.toNumber();
    }
    return serialized;
}
export async function createAccount(data: any) {
    try{
        const {userId}=await auth();
        if(!userId) return {error:"Unauthorized"};
        const user=await db.user.findUnique({where:{clerkUserId:userId}});
        if(!user) return {error:"Unauthorized"};
        // convert balance to float before saving
        const balanceFloat=parseFloat(data.balance);
        if(isNaN(balanceFloat)){
            throw new Error("Invalid balance");
        }
        // Check if this is user's first account
        const existingAccounts=await db.account.findMany({where:{userId:user.id}});
        const shouldBeDefault=existingAccounts.length===0?true:data.isDefault;
        // if this account should be default unset other default accounts
        if(shouldBeDefault){
            await db.account.updateMany({where:{userId:user.id,isDefault:true},data:{isDefault:false}});
        }
        const account=await db.account.create({
            data:{
                ...data,
                balance:balanceFloat,
                userId:user.id,
                isDefault:shouldBeDefault
            }
        });
        const serializedAccount=serializeTransaction(account);
        revalidatePath("/dashboard");
        return {success:true,data:serializedAccount};
    }catch(error){
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('An unknown error occurred');
    }
}
export async function getUserAccounts() {
    const {userId}=await auth();
    if(!userId) return {error:"Unauthorized"};
    const user=await db.user.findUnique({where:{clerkUserId:userId}});
    if(!user) {
        throw new Error("User not found");
    }
    const accounts=await db.account.findMany({
        where:{userId:user.id},
        orderBy:{createdAt:"desc"},
        include:{
            _count:{
                select:{transactions:true}
            }
        }
    });
    const serializedAccount=accounts.map(serializeTransaction);
    return {serializedAccount};
}
export async function getDashboardData(){
    const {userId}=await auth();
    if(!userId) return {error:"Unauthorized"};
    const user=await db.user.findUnique({where:{clerkUserId:userId}});
    if(!user) {
        throw new Error("User not found");
    }
    // get all user transactions 
    const transactions=await db.transaction.findMany({
        where:{userId:user.id},
        orderBy:{date:"desc"},
    })
    return transactions.map(serializeTransaction);
}