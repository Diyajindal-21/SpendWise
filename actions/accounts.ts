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
    if (obj.type) {
        serialized.type = obj.type.toString();
      }
    return serialized;
}
export const updateDefaultAccount=async (accountId: string)=>{
    try{
        const {userId}=await auth();
    if(!userId) return {error:"Unauthorized"};
    const user=await db.user.findUnique({where:{clerkUserId:userId}});
    if(!user) {
        throw new Error("User not found");
    }
    await db.account.updateMany({where:{userId:user.id,isDefault:true},data:{isDefault:false}});
    const account=await db.account.update({
        where:{
            id:accountId,
            userId:user.id,
        },
        data:{
            isDefault:true
        }
    });
    revalidatePath("/dashboard");
    return {success:true,data:serializeTransaction(account)};
    }catch(error){
        return {success:false,error:(error as Error).message};
    }
}
export const getAccountWithTransactions=async (accountId: string)=>{
    const {userId}=await auth();
    if(!userId) return {error:"Unauthorized"};
    const user=await db.user.findUnique({where:{clerkUserId:userId}});
    if(!user) {
        throw new Error("User not found");
    }  
    const account=await db.account.findUnique({
        where:{
            id:accountId,
            userId:user.id,
        },
        include:{
            transactions:{
                orderBy:{
                    date:"desc"
                }
            },
            _count:{
                select:{
                    transactions:true
                }
            }
        }
    }); 
    if(!account) {
        return null;
    }
    return{
        ...serializeTransaction(account),
       transactions:account.transactions.map(serializeTransaction)
    }
}
export async function bulkDeleteTransactions(transactionIds: any){
    try{
        const {userId}=await auth();
    if(!userId) return {error:"Unauthorized"};
    const user=await db.user.findUnique({where:{clerkUserId:userId}});
    if(!user) {
        throw new Error("User not found");
    }  
    const transactions =await db.transaction.findMany({
        where:{
            id:{
                in:transactionIds,
            },
            userId:user.id,
        }
    });
    const accountBalanceChanges=transactions.reduce((acc,transaction)=>{
        const change=transaction.type==="EXPENSE"?
        transaction.amount:
        -transaction.amount;
        acc = { ...acc, [transaction.accountId]: (acc[transaction.accountId as keyof typeof acc] || 0) + change };
        return acc;
    }
    ,{})
    // Delete transactions and update account balance in a transaction
    await db.$transaction(async (tx) => {
      await tx.transaction.deleteMany({
        where: {
          id: {
            in: transactionIds,
          },
          userId: user.id,
        },
      });

      // Update account balance
      for (const [accountId,balanceChange] of Object.entries (accountBalanceChanges)) {
          await tx.account.update({
            where: { id: accountId },
            data: { balance: { increment: Number(balanceChange) } },
          });
      }
    });
    revalidatePath("/dashboard");
    revalidatePath("/account/[id]");
    return {success:true};
    }catch(error){
        return {success:false,error:(error as Error).message};
    }
}