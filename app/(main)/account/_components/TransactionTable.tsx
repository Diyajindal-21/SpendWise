"use client"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { categoryColors } from "@/data/categories"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { Badge, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Clock, MoreHorizontal, RefreshCcw, Search, Trash, X } from "lucide-react"
import { ReactNode, SetStateAction, useEffect, useMemo, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { bulkDeleteTransactions } from "@/actions/accounts"
import useFetch from "@/hooks/use-fetch"
import { toast } from "sonner"
import BarLoader from "react-spinners/BarLoader"
const RECURRING_INTERVALS={
  DAILY:"Daily",
  WEEKLY:"Weekly",
  MONTHLY:"Monthly",
  YEARLY:"Yearly"
}
const TransactionTable = ({ transactions }: { transactions: Array<{
  nextRecurringDate: string | number | Date
  isRecurring: boolean
  type: string
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  recurringInterval: string;
}> }) => {
    const router=useRouter();
    const [selectedIds,setSelectedIds]=useState<string[]>([]);
    const [sortConfig,setSortConfig]=useState({
        field:"date",
        direction:"desc"
    });
    const [searchTerm,setSearchTerm]=useState("");
    const [typeFilter,setTypeFilter]=useState("");
    const [recurringFilter,setRecurringFilter]=useState("");
    const [currentPage,setCurrentPage]=useState(1);
    const {
        loading:deleteLoading,
        fn:deleteFn,
        data:deleted
    }=useFetch(bulkDeleteTransactions);
    const filteredAndSortedTransactions=useMemo(()=>{
        let result=[...transactions];
        // apply search filter
        if(searchTerm){
            result=result.filter((transaction)=>transaction.description.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        // apply recurring filter
        if(recurringFilter){
            result=result.filter((transaction)=>{
                if(recurringFilter==="recurring"){
                    return transaction.isRecurring;
                }
                return !transaction.isRecurring;
            })
        }
        // apply type filter
        if(typeFilter){
            result=result.filter((transaction)=>transaction.type===typeFilter);
        }
        // apply sorting
        result.sort((a,b)=>{
            let comparison=0;
            switch(sortConfig.field){
                case "date":
                    comparison=(new Date(a.date)).getTime()-(new Date(b.date)).getTime();
                    break;
                case "category":
                    comparison=a.category.localeCompare(b.category);
                    break;
                case "amount":
                    comparison=a.amount-b.amount;
                    break;
                default:
                    comparison=0;
            }
            return sortConfig.direction==="asc"?comparison:-comparison;
        })
        return result;
    },[
        transactions,
        searchTerm,
        typeFilter,
        recurringFilter,
        sortConfig
    ]);
    const ITEMS_PER_PAGE = 10;
    const totalPages = Math.ceil(
        filteredAndSortedTransactions.length / ITEMS_PER_PAGE
      );
    const paginatedTransactions=useMemo(()=>{
      const startIndex=(currentPage-1)*ITEMS_PER_PAGE;
      return filteredAndSortedTransactions.slice(startIndex,startIndex+ITEMS_PER_PAGE)
    },[filteredAndSortedTransactions,currentPage])
    const handleSort=(field: string)=>{
        setSortConfig(current=>({
            field,
            direction:current.field==field && current.direction==="asc"?"desc":"asc"
        }))
    }
    const handleSelect=(id: string)=>{
        setSelectedIds((current) => {
            if(current.includes(id)){
                return current.filter((selectedId)=>selectedId!==id);
            }else{
                return [...current,id];
            }
        })
    }
    const handleSelectAll = () => {
        setSelectedIds((current) =>
          current.length === paginatedTransactions.length
            ? []
            : paginatedTransactions.map((t) => t.id)
        );
      };
    const handlePageChange = (newPage: SetStateAction<number>) => {
        setCurrentPage(newPage);
        setSelectedIds([]); // Clear selections on page change
      };
    const handleBulkDelete=async()=>{
      if(!window.confirm(`Are you sure you want to delete ${selectedIds.length} transactions?`)){
        return;
      }
      deleteFn(selectedIds);
    }
    useEffect(()=>{
        if(deleted && !deleteLoading){
          toast.error("Transactions deleted successfully");
        }
    },[deleted,deleteLoading])
    const handleClearFilters=()=>{
      setSearchTerm("");
      setTypeFilter("");
      setRecurringFilter("");
      setSelectedIds([]);
    }
    return(
      <div className="space-y-6">
      {/* Loading Bar */}
      {deleteLoading && (
        <BarLoader className="mt-4" width={"100%"} color="#5f5fff" />
      )}
    
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative w-full">
      <Search className="mr-4 absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
  <Input
    type="text"
    placeholder="    Search transactions..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full pl-8 pr-4 py-2 rounded-lg bg-[#23234a] border border-white/10 text-white placeholder-[#b0b3c7] focus:ring-2 focus:ring-[#5f5fff] outline-none transition"
  />
</div>
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="bg-[#23234a] border border-white/10 text-white rounded-lg">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="bg-[#23234a] border border-white/10 text-white rounded-lg">
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>
          <Select value={recurringFilter} onValueChange={setRecurringFilter}>
            <SelectTrigger className="w-[140px] bg-[#23234a] border border-white/10 text-white rounded-lg">
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent className="bg-[#23234a] border border-white/10 text-white rounded-lg">
              <SelectItem value="recurring">Recurring Only</SelectItem>
              <SelectItem value="non-recurring">Non-Recurring Only</SelectItem>
            </SelectContent>
          </Select>
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                size="sm"
                className="rounded-lg"
                onClick={handleBulkDelete}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete Selected ({selectedIds.length})
              </Button>
            </div>
          )}
          {(searchTerm || typeFilter || recurringFilter) && (
            <Button
              variant="ghost"
              size="icon"
              className="border border-white/10 text-[#b0b3c7] hover:bg-[#23234a] hover:text-white rounded-lg"
              onClick={handleClearFilters}
              title="Clear Filters"
            >
              <X className="h-4 w-5" />
            </Button>
          )}
        </div>
      </div>
    
      {/* Transactions Table */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#23234a]/80 to-[#181830]/90 shadow-xl overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  onCheckedChange={handleSelectAll}
                  checked={
                    selectedIds.length === paginatedTransactions.length &&
                    paginatedTransactions.length > 0
                  }
                />
              </TableHead>
              <TableHead
                className="cursor-pointer text-white"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center">
                  Date
                  {sortConfig.field === "date" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead className="text-white">Description</TableHead>
              <TableHead
                className="cursor-pointer text-white"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center">
                  Category
                  {sortConfig.field === "category" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer text-white"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center justify-end">
                  Amount
                  {sortConfig.field === "amount" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead className="text-white">Recurring</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-[#b0b3c7]">
                  No Transactions Found
                </TableCell>
              </TableRow>
            ) : (
              paginatedTransactions.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  className="hover:bg-[#23234a]/60 transition"
                >
                  <TableCell>
                    <Checkbox
                      onCheckedChange={() => handleSelect(transaction.id)}
                      checked={selectedIds.includes(transaction.id)}
                    />
                  </TableCell>
                  <TableCell className="text-[#b0b3c7]">
                    {format(new Date(transaction.date), "PP")}
                  </TableCell>
                  <TableCell className="text-white">
                    {transaction.description}
                  </TableCell>
                  <TableCell className="capitalize">
                    <span
                      style={{
                        background:
                          categoryColors[
                            transaction.category as keyof typeof categoryColors
                          ],
                      }}
                      className="px-2 py-1 rounded text-white text-sm"
                    >
                      {transaction.category}
                    </span>
                  </TableCell>
                  <TableCell
                    className="text-right font-semibold"
                    style={{
                      color: transaction.type === "EXPENSE" ? "#f87171" : "#34d399",
                    }}
                  >
                    {transaction.type === "EXPENSE" ? "-" : "+"}
                    ${transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {transaction.isRecurring ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200 flex items-center rounded p-1">
                              <RefreshCcw className="h-3 w-3" />
                              {
                                RECURRING_INTERVALS[
                                  transaction.recurringInterval as keyof typeof RECURRING_INTERVALS
                                ]
                              }
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">
                              <div className="font-medium">Next Date:</div>
                              <div>
                                {format(
                                  new Date(transaction.nextRecurringDate),
                                  "PP"
                                )}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <span className="gap-1 flex items-center text-[#b0b3c7]">
                        <Clock className="h-3 w-3" />
                        One-Time
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 text-[#b0b3c7] hover:bg-[#23234a]/70"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-[#23234a] border border-white/10 text-white rounded-lg">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/transaction/create?edit=${transaction.id}`)
                          }
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-400"
                          onClick={() => deleteFn([transaction.id])}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="ghost"
            size="icon"
            className="border border-white/10 text-[#b0b3c7] hover:bg-[#23234a] hover:text-white rounded-lg"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-[#b0b3c7]">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="border border-white/10 text-[#b0b3c7] hover:bg-[#23234a] hover:text-white rounded-lg"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
    
    )
}
export default TransactionTable