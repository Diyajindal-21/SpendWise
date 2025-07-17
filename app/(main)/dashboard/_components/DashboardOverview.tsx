"use client"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
interface Account {
    id: string;
    name: string;
    isDefault?: boolean;
  }
  const COLORS = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEEAD",
    "#D4A5A5",
    "#9FA8DA",
  ];
  interface Transaction {
    category: any;
    type: string;
    id: string;
    accountId: string;
    description: string;
    amount: number;
    date: string;
  }
const DashboardOverview = ({
  accounts,
  transactions
}:  {
    accounts: Account[];
    transactions: Transaction[];
  }) => {
    const [selectedAccountId,setSelectedAccountId]=useState(accounts.find((a)=>a.isDefault)?.id || accounts[0]?.id);
    // filter transactions for selected account
    const accountTransactions=transactions.filter((t: { accountId: any; })=>t.accountId===selectedAccountId);
    const recentTransactions = accountTransactions.sort((a: { date: string | number | Date; },b: { date: string | number | Date; }) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0,5);
    interface Transaction {
        id: string;
        date: string;
        amount: number;
        category: string;
        type: "INCOME" | "EXPENSE";
        accountId: string;
        // Add other fields if necessary
      }
    // calculate expense breakdown for current month
    const currentDate=new Date();
    const currentMonthExpenses = accountTransactions.filter((t) => {
        const transactionDate=new Date(t.date);
        return(
            t.type==="EXPENSE" && transactionDate.getMonth()===currentDate.getMonth() && transactionDate.getFullYear()===currentDate.getFullYear()
        )
    });
    // group expenses by category
    const expenseByCategory: Record<string, number> = currentMonthExpenses.reduce((acc, transaction) => {
        const category = transaction.category;
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += transaction.amount;
        return acc;
      }, {} as Record<string, number>);
    //   format data for piechart
    const pieChartData=Object.entries(expenseByCategory).map(([category,amount])=>({
        name:category,
        value:amount
    }));
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full px-4 sm:px-6 md:px-0">
        {/* Recent Transactions Card */}
        <Card className="bg-gradient-to-br from-[#23234a]/80 to-[#181830]/90 border border-white/10 rounded-2xl shadow-xl backdrop-blur-md w-full">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 pb-4 px-4 pt-4">
            <CardTitle className="text-base font-semibold text-white">
              Recent Transactions
            </CardTitle>
            <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
              <SelectTrigger className="w-full sm:w-[140px] bg-[#23234a] border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-[#5f5fff] transition">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent className="bg-[#23234a] text-white border border-white/10 rounded-lg">
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="px-3 pb-6">
            <div className="space-y-4">
              {recentTransactions.length === 0 ? (
                <p className="text-center text-[#b0b3c7] py-4">
                  No recent transactions
                </p>
              ) : (
                recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between bg-[#23234a]/60 rounded-xl px-4 py-3 shadow-sm"
                  >
                    <div className="space-y-1">
                      <p className="text-md font-medium leading-none text-white break-all">
                        {transaction.description || "Untitled Transaction"}
                      </p>
                      <p className="text-xs text-[#b0b3c7]">
                        {format(new Date(transaction.date), "PP")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "flex items-center font-semibold text-base",
                          transaction.type === "EXPENSE"
                            ? "text-rose-400"
                            : "text-green-400"
                        )}
                      >
                        {transaction.type === "EXPENSE" ? (
                          <ArrowDownRight className="mr-1 h-4 w-4" />
                        ) : (
                          <ArrowUpRight className="mr-1 h-4 w-4" />
                        )}
                        ${transaction.amount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
  
        {/* Monthly Expense Breakdown Card */}
        <Card className="bg-gradient-to-br from-[#23234a]/80 to-[#181830]/90 border border-white/10 rounded-2xl shadow-xl backdrop-blur-md w-full">
          <CardHeader className="px-4 pt-4">
            <CardTitle className="text-base font-semibold text-white">
              Monthly Expense Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 pb-5 px-4">
            {pieChartData.length === 0 ? (
              <p className="text-center text-[#b0b3c7] py-4">
                No expenses this month
              </p>
            ) : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => `$${value.toFixed(2)}`}
                      contentStyle={{
                        backgroundColor: "rgb(177, 177, 182)",
                        border: "1px solid rgb(177, 177, 182)",
                        borderRadius: "12px",
                        color: "#181830"
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
}
export default DashboardOverview;