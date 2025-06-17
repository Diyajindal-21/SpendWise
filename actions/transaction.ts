"use server";
import aj from "@/lib/arcjet";
import { db } from "@/lib/prisma";
import {request}  from "@arcjet/next";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";

const serializeAmount = (obj: { amount: { toNumber: () => number } }) => ({
  ...obj,
  amount: obj.amount.toNumber(),
});

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export type TransactionInput = {
  accountId: string;
  amount: number;
  type: "EXPENSE" | "INCOME";
  date: string;
  category: string;
  isRecurring?: boolean;
  recurringInterval?: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
};

export const createTransaction = async (data: TransactionInput) => {
  try {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    // Arcjet rate limiting
    const req = await request();

    // Check rate limit
    const decision = await aj.protect(req, {
      userId,
      requested: 1, // Specify how many tokens to consume
    });
    
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        const { remaining, reset } = decision.reason;
        console.log({
          code: "RATE_LIMIT_EXCEEDED",
          details: { remaining, resetInSeconds: reset },
        });
        return { error: "Too many requests. Please try again later." };
      }
      return { error: "Request Blocked" };
    }

    const user = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) return { error: "User not found" };

    const account = await db.account.findUnique({
      where: { id: data.accountId, userId: user.id },
    });
    if (!account) return { error: "Account not found" };

    const balanceChange = data.type === "EXPENSE" ? -data.amount : data.amount;
    const newBalance = account.balance.toNumber() + balanceChange;

    const transaction = await db.$transaction(async (tx) => {
      const newTransaction = await tx.transaction.create({
        data: {
          ...data,
          userId: user.id,
          date: new Date(data.date), // Ensure date is a Date object
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurringDate(data.date, data.recurringInterval)
              : null,
        },
      });
      await tx.account.update({
        where: { id: data.accountId },
        data: { balance: newBalance },
      });
      return newTransaction;
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${transaction.accountId}`);
    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    console.error("Transaction creation failed:", error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
};

function calculateNextRecurringDate(
  startDate: string | number | Date,
  interval: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY"
): Date {
  const date = new Date(startDate);
  switch (interval) {
    case "DAILY":
      date.setDate(date.getDate() + 1);
      break;
    case "WEEKLY":
      date.setDate(date.getDate() + 7);
      break;
    case "MONTHLY":
      date.setMonth(date.getMonth() + 1);
      break;
    case "YEARLY":
      date.setFullYear(date.getFullYear() + 1);
      break;
  }
  return date;
}

export const scanRecipt = async (file: { arrayBuffer: () => Promise<ArrayBuffer>; type: string }) => {
  try {
    const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });
    const arrayBuffer = await file.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString("base64");
    const prompt = `
      Analyze this receipt image and extract the following information in JSON format:
      - Total amount (just the number)
      - Date (in ISO format)
      - Description or items purchased (brief summary)
      - Merchant/store name
      - Suggested category (one of: Housing,Transportation,Groceries,Utilities,Entertainment,Food,Shopping,Healthcare,Education,Personal,Travel,Insurance,Gifts,Bills,Other-expense )
      
      Only respond with valid JSON in this exact format:
      {
        "amount": number,
        "date": "ISO date string",
        "description": "string",
        "merchantName": "string",
        "category": "string"
      }
        Respond ONLY with valid JSON. Do NOT include any text, explanation, or markdown.
      If its not a recipt, return an empty object
    `;
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      },
      prompt,
    ]);
    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g,"").trim();
    try {
      const data = JSON.parse(cleanedText);
      console.log(data);
      return {
        amount: parseFloat(data.amount),
        date: new Date(data.date),
        description: data.description,
        merchantName: data.merchantName,
        category: data.category,
      };
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return { error: "Failed to parse JSON response from the model." };
    }
  } catch (error) {
    console.error("Error scanning receipt:", error);
    return { error: "Failed to scan receipt." };
  }
};

export async function getTransaction(id: any) {
  const {userId}=await auth();
  if(!userId) return {error:"Unauthorized"};
  const user=await db.user.findUnique({where:{clerkUserId:userId}});
  if(!user) return {error:"User not found"};
  const transaction=await db.transaction.findUnique({where:{id,userId:user.id}});
  if(!transaction) return {error:"Transaction not found"};
  return serializeAmount(transaction);
}
export async function updateTransaction(id: any,data:any){
  try{
    const {userId}=await auth();
    if(!userId) return {error:"Unauthorized"};
    const user=await db.user.findUnique({where: {clerkUserId:userId}});
    if(!user) return {error:"User not found"};
    // get original transaction to calculate balance change
    const originalTransaction=await db.transaction.findUnique({
      where:{
        id,
        userId:user.id
      },
      include:{
        account:true
      },
    });
    if(!originalTransaction){
      throw new Error("Transaction not found");
    }
    // calculate balance change
    const oldBalanceChange=
    originalTransaction.type==="EXPENSE"?-originalTransaction.amount.toNumber():originalTransaction.amount.toNumber();
    const newBalanceChange=
    data.type==="EXPENSE"?-data.amount:data.amount;
    const netBalanceChange=newBalanceChange-oldBalanceChange;
    // update transaction and account balance in a transaction
    const transaction=await db.$transaction(async(tx)=>{
      const updated=await tx.transaction.update({
        where:{
          id,
          userId:user.id
        },
        data:{
          ...data,
          nextRecurringDate:
          data.isRecurring&&data.recurringInterval?calculateNextRecurringDate(data.date,data.recurringInterval):null,
        }
      });
      // update account balance
      await tx.account.update({
        where:{
          id:updated.accountId
        },
        data:{
          balance:{
            increment:netBalanceChange
          }
        }
      });
      return updated;
    });
    revalidatePath("/dashboard");
    revalidatePath(`/account/${data.accountId}`);
    return {success:true,data:serializeAmount(transaction)}
  }catch(error){
    throw new Error(error as Error["message"]);
  }
}