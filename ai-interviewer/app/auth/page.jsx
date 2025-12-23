"use client"
import React from 'react'
import Image from "next/image";
import { Button } from "@/components/ui/button"
import { supabase } from '@/services/supabaseClient';


function Login() {

    const signInWithGoogle= async ()=>{
        const {error}=await supabase.auth.signInWithOAuth({
            provider:'google'
        })

        if(error){
            console.error('Error:',error.message)
        }
    }



  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <div className='flex flex-col items-center'>
        <Image src={'/logo.png'} alt='logo' 
        width={100} 
        height={100}
        className='w-[180px]'/>
        <div className='flex items-center flex-col border-2 border-black rounded-2xl p-8'> 
            <Image src={'/login1.png'} alt='login'
            width={600}
            height={400}
            className='w-[400px] h-[250px] border rounded-2xl'/>
            <h2 className='text-2xL font-bold text-center mt-5'>Welcome to a-interviewer</h2>
            <p className='text-gray-500 text-center'>Sign In with Google Authentication</p>
            <Button className='mt-7 w-full'
             onClick={signInWithGoogle}> Login with Google</Button>
        </div>
      </div>
    </div>
  )
}

export default Login
