"use client"
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { endOfDay, format, startOfDay, subDays } from 'date-fns';
import { useMemo, useState } from 'react';
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
const DATE_RANGES={
    "7D":{label:"Last 7 Days",days:7},
    "1M":{label:"Last Month",days:30},
    "3M":{label:"Last 3 Months",days:90},
    "6M":{label:"Last 6 Months",days:180},
    ALL:{label:"All Time",days:null},
}
const AccountChart = ({transactions}: {transactions: Array<{
    amount: number;
    type: string;date: string
}>}) => {
    const [dateRange,setDateRange]=useState("1M");
    const filteredData=useMemo(()=>{
      const range = DATE_RANGES[dateRange as keyof typeof DATE_RANGES];
      const now=new Date();
      const startDate=range.days?
      startOfDay(subDays(now,range.days))
      :startOfDay(new Date(0));
      const filtered=transactions.filter(
        (transaction)=>new Date(transaction.date)>=startDate&&
        new Date(transaction.date)<=endOfDay(now)
      );
      type GroupedEntry = {
        date: string;          // formatted for display
        realDate: Date;        // real Date for sorting
        income: number;
        expense: number;
      };
      const grouped=filtered.reduce((acc,transaction)=>{
        const realDate = startOfDay(new Date(transaction.date));
        const date=format(realDate,"MMM-dd");
        if (!acc[date]) {
            acc[date] = {
              date,
              realDate,
              income: 0,
              expense: 0,
            };
          }
        if(transaction.type==="INCOME"){
          acc[date].income+=transaction.amount;
        }else{
          acc[date].expense+=transaction.amount;
        }
        return acc;
      },{} as Record<string, GroupedEntry>);
    //   convert to array and sort by date
    return Object.values(grouped).sort(
      (a,b)=> a.realDate.getTime() - b.realDate.getTime()
    );
    },[transactions,dateRange]);
    const totals=useMemo(()=>{
        return filteredData.reduce(
          (acc,day)=>({
            income:acc.income+day.income,
            expense:acc.expense+day.expense,
          }),{
            income:0,
            expense:0,
          }
        )
    },[filteredData]);
  return (
    <Card className="bg-gradient-to-br from-[#23234a]/80 to-[#181830]/90 border border-white/10 rounded-2xl shadow-xl backdrop-blur-md">
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 px-4 pt-4">
    <CardTitle className="text-2xl font-semibold text-white">Transaction Overview</CardTitle>
    <Select defaultValue={dateRange} onValueChange={setDateRange}>
      <SelectTrigger className="w-[140px] bg-[#23234a] border border-white/10 text-white rounded-lg">
        <SelectValue placeholder="Select Range" />
      </SelectTrigger>
      <SelectContent className="bg-[#23234a] border border-white/10 text-white rounded-lg">
        {Object.entries(DATE_RANGES).map(([key, value]) => (
          <SelectItem key={key} value={key} className="hover:bg-[#2a2a40]">
            {value.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </CardHeader>
  <CardContent className="px-6 pb-6">
    <div className="flex justify-around mb-6 text-sm text-[#b0b3c7]">
      <div className="text-center">
        <p className="text-md text-muted-foreground">Total Income</p>
        <p className="text-lg font-bold text-green-400">${totals.income.toFixed(2)}</p>
      </div>
      <div className="text-center">
        <p className="text-md  text-muted-foreground">Total Expenses</p>
        <p className="text-lg font-bold text-red-400">${totals.expense.toFixed(2)}</p>
      </div>
      <div className="text-center">
        <p className="text-md  text-muted-foreground">Net</p>
        <p className={`text-lg font-bold ${totals.income - totals.expense >= 0 ? "text-green-400" : "text-red-400"}`}>
          ${(totals.income - totals.expense).toFixed(2)}
        </p>
      </div>
    </div>
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height={"100%"}>
        <BarChart
          data={filteredData}
          margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#32325d" />
          <XAxis dataKey="date" stroke="#b0b3c7" />
          <YAxis
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
            stroke="#b0b3c7"
          />
          <Tooltip
            formatter={(value) =>[`$${Number(value).toFixed(2)}`, undefined]}
            contentStyle={{
              backgroundColor: "#181830",
              color: "#b0b3c7",
              borderRadius: "12px",
              border: "1px solid #32325d",
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
              padding: "10px 16px",
            }}
          />
          <Legend wrapperStyle={{ color: "#b0b3c7" }} />
          <Bar name="Income" dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} />
          <Bar name="Expense" dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </CardContent>
</Card>

  );
};

export default AccountChart;