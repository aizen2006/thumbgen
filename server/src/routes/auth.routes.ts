import { Router } from "express";
import { userLogout, userSignIn , userSignUp } from "../controllers/auth.controllers";

const app = Router();

app.post("/signUp",userSignUp);
app.post("/signIn",userSignIn);
app.post("/logout",userLogout);

export default app;