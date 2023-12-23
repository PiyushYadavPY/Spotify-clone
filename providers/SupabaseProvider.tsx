"use client"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";

import { Database } from "@/types_db";

interface SupabaseProviderProps {
    children: React.ReactNode;
};

const SupabaseProvider: React.FC<SupabaseProviderProps> = ({
    children
})=> {
    const [supabaseClient] = useState(()=> createClientComponentClient<Database>(
        {
            supabaseUrl : "https://qjudqfwngyasuhoapcxj.supabase.co",
            supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqdWRxZnduZ3lhc3Vob2FwY3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE5NDE3MzMsImV4cCI6MjAxNzUxNzczM30.jc6ihf0PyboDLAalTg1u4zml6OllRtrpDmpf-0rtLrE"
        }
    )
   
    );
    return(
        <SessionContextProvider supabaseClient={supabaseClient}> 
        {children}
        </SessionContextProvider>
    )
}

export default SupabaseProvider;