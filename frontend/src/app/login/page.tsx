'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {supabase} from '@/lib/supabaseClient';
export default function LoginPage() {
  const router=useRouter();
  const [email,setEmail] = useState('');
  const [password,setPassword] =useState('');
  const [isLoading,setIsLoading] =useState(false);
  const handleLogin=async() => {
    if (!email||!password) {
      alert('Please enter email and password');
      return;
    }
    setIsLoading(true);
    const {error} = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setIsLoading(false);
    if (error) {
      alert('Login failed. Check credentials or verify email.');
      return;
    }
    router.push('/tasks');
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-96 space-y-4">
        <h1 className="text-2xl font-bold">Login</h1>
        <input
          className="border p-2 w-full"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="bg-black text-white w-full p-2 disabled:opacity-50"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        <p
          className="text-sm underline cursor-pointer"
          onClick={()=>router.push('/signup')}
        >
          New user? Signup
        </p>
      </div>
    </div>
  );
}
