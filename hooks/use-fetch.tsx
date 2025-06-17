import { useState } from "react";
import { toast } from "sonner";

const useFetch=(cb: (...args: any[]) => any)=>{
    const [data,setData]=useState<any>(undefined);
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState<Error | null>(null);
    const fn=async(...args: any[])=>{
        setLoading(true);
        setError(null);
        try{
            const response=await cb(...args);
            setData(response);
            setError(null);
        }catch(error){
            const err=error as Error;
            setError(err);
            toast.error(err.message);
        }finally{
           setLoading(false); 
        }
    }
    return {data,loading,error,fn,setData};
};
export default useFetch;