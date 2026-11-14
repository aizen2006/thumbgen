import type { Request, Response } from 'express';
import { signupUser } from '../services/auth.services';

export async function userSignUp(req:Request,res:Response){
    try {
        const {name ,email , password} = req.body;
        // validation
        if(!name || !email || !password){
            return res.status(400).json({
                message:"Please enter the all the details"
            });
        }
        const result = await signupUser({ email, name, password});

        const { user , token } = result;
        // store the JWT in cookie's
        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"lax",
            maxAge: 7*24*60*60,
        });

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            user,
        });

    } catch (error) {
        throw new Error("Error while doing user sign up",{cause:error});
    }
}

export async function userSignIn(){

}

export async function userLogout(){

}
