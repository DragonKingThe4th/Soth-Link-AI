import {Navigate,useLocation} from 'react-router-dom';
import type {ReactNode} from 'react';
import {useAuth} from '../contexts/AuthContext';
export default function ProtectedRoute({children}:{children:ReactNode}){const {user,loading}=useAuth();const location=useLocation();if(loading)return <div className="grid min-h-screen place-items-center bg-paper text-muted">Opening your archive…</div>;if(!user)return <Navigate to="/sign-in" replace state={{from:location.pathname}}/>;return <>{children}</>}
