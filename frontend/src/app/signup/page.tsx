'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {supabase} from '@/lib/supabaseClient';
export default function SignupPage() {
  const router=useRouter();
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [isLoading,setIsLoading]=useState(false);
  const handleSignup=async()=> {
    if (!email||!password) {
      alert('Please enter email and password');
      return;
    }
    setIsLoading(true);
    const {error} = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:'http://localhost:3000/login',
      },
    });
    setIsLoading(false);
    if (error) {
      alert(error.message);
      return;
    }
    alert('Signup successful.Please check your email to verify your account.');
    router.push('/login');
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-96 space-y-4">
        <h1 className="text-2xl font-bold">Signup</h1>
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
          onClick={handleSignup}
          disabled={isLoading}
          className="bg-black text-white w-full p-2 disabled:opacity-50"
        >
          {isLoading ? 'Signing up...' : 'Signup'}
        </button>
        <p
          className="text-sm underline cursor-pointer"
          onClick={()=>router.push('/login')}
        >
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}
