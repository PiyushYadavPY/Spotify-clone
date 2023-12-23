import { UserDetails , Subscription } from "@/types";
import { User } from "@supabase/auth-helpers-nextjs";
import { useSessionContext , useUser as useSupaUser } from "@supabase/auth-helpers-react";

import { createContext, useState , useEffect, useContext} from "react";

type UserContextType = {
    accessToken : string | null;
    user : User | null;
    usesDetails : UserDetails | null;
    isLoading : boolean;
    subscrption: Subscription | null;
};

export const UserContext = createContext<UserContextType | undefined> (
    undefined
);

export interface Props {
    [propName: string]: any;
}

export const MyUserContextProvider = (props :Props) =>{
    const {
        session,
        isLoading: isLoadingUser,
        supabaseClient : supabase
    } = useSessionContext();
    const user = useSupaUser();
    const accessToken = session?.access_token ?? null;
    const [isLoadingData , setIsLoadingData] = useState(false);
    const [UserDetails , setUserDetails] = useState<UserDetails | null> (null);
    const [subscription , setSubscrption] = useState<Subscription | null>(null);

    const getUserDetails = () => supabase.from('users').select('*').single();
    const getSubscription = () => 
    supabase
    .from('subscription')
    .select('*, prices(*, products(*))')
    .in('status',['trialing', 'active'])
    .single();
    
    useEffect(() =>{
        if(user && !isLoadingData && !UserDetails  && !subscription ){
            setIsLoadingData(true);
            Promise.allSettled([getUserDetails , getSubscription()]).then(
                (results) =>{
                    const userDetailsPromise = results[0];
                    const subscriptionPromise = results[1];

                    if(userDetailsPromise.status === "fulfilled"){
                        setUserDetails(userDetailsPromise.value.data as UserDetails);
                    }
                    if(subscriptionPromise.status === "fulfilled" ){
                        setSubscrption(subscriptionPromise.value.data as Subscription);
                    }

                    setIsLoadingData(false)

                }
            );
        } else if(!user && !isLoadingUser && !isLoadingData){
            setUserDetails(null);
            setSubscrption(null);

        }
    }, [user , isLoadingUser]);

    const value = {
        accessToken,
        user,
        UserDetails,
        isLoading: isLoadingUser || isLoadingData,
        subscription
    };

    return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () =>{
    const context = useContext(UserContext);
    if(context === undefined ) {
        throw new Error('useUser must be used within a MyUserContextProvider');
    }
    return context;
}
