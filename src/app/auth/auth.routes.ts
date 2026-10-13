import { Routes } from "@angular/router";


import { LoginPage } from "./pages/login-page/login-page";
import { RegisterPage } from "./pages/register/register-page";
import { ActivateAccount } from "./pages/activate-account/activate-account";
import { registerFlowGuard } from "../core/guards/register-flow-guard";
import { ConfirmEmail } from "./pages/confirm-email/confirm-email";

export const routes: Routes = [
    {
        path: 'login',
        component: LoginPage
    },
    {
        path: 'register',
        component: RegisterPage
    },
    {
        path: 'activate-account',
        component: ActivateAccount,
        canActivate: [registerFlowGuard]
    },
    {
        path: 'confirm-email/:token',
        component: ConfirmEmail
    }
]

export default routes;