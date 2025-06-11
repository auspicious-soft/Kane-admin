import React from 'react';
import AuthImage from "@/components/(auth)/auth-image";
import { Card, CardContent } from "@/components/ui/card";
import { Otp } from '@/components/(auth)/otp';
const Page = () => {
    return (
           <Card className="overflow-hidden p-0 bg-[#182226] border-0 shadow-none h-screen"> 
        <CardContent className="grid p-0 md:grid-cols-2 h-screen items-center overflow-auto ">
            <Otp />
          <AuthImage /> 
        </CardContent>
      </Card>
    );
}

export default Page;
