import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "spendwise",name:"Spendwise",
    retryFunction:async(attempt: number)=>({
        delay:Math.pow(2,attempt)*1000,
        maxAttempts:2,
    })
});
