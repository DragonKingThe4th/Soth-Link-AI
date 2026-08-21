import {createContext,useContext,useEffect,useMemo,useState} from 'react';
import type {ReactNode} from 'react';
import {GoogleAuthProvider,onAuthStateChanged,signInWithPopup,signOut} from '@firebase/auth';
import type {User} from '@firebase/auth';
import {auth,firebaseIsConfigured} from '../lib/firebase';

type AuthValue={user:User|null;loading:boolean;configured:boolean;signInWithGoogle:()=>Promise<void>;signOutUser:()=>Promise<void>};
const AuthContext=createContext<AuthValue|undefined>(undefined);
export function AuthProvider({children}:{children:ReactNode}){const [user,setUser]=useState<User|null>(null);const [loading,setLoading]=useState(true);useEffect(()=>{if(!auth){setLoading(false);return}return onAuthStateChanged(auth,next=>{setUser(next);setLoading(false)})},[]);const value=useMemo<AuthValue>(()=>({user,loading,configured:firebaseIsConfigured,signInWithGoogle:async()=>{if(!auth)throw new Error('Firebase has not been configured yet.');const provider=new GoogleAuthProvider();provider.setCustomParameters({prompt:'select_account'});await signInWithPopup(auth,provider)},signOutUser:async()=>{if(auth)await signOut(auth)}}),[user,loading]);return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>}
export function useAuth(){const value=useContext(AuthContext);if(!value)throw new Error('useAuth must be used inside AuthProvider');return value}
