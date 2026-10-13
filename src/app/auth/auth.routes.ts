import { Routes } from "@angular/router";


import { LoginPage } from "./pages/login-page/login-page";
import { RegisterPage } from "./pages/register/register-page";
import { ActivateAccount } from "./pages/activate-account/activate-account";
import { registerFlowGuard } from "../core/guards/register-flow-guard";
import { loginFlowGuard } from "../core/guards/login-flow-guard";
import { ConfirmEmail } from "./pages/confirm-email/confirm-email";
import { SuspendedAccount } from "./pages/suspended-account/suspended-account";

export const routes: Routes = [
    {
        path: 'login',
        component: LoginPage,
        title: 'Iniciar sesión | DevVault'
    },
    {
        path: 'register',
        component: RegisterPage,
        title: 'Registrarse | DevVault'
    },
    {
        path: 'activate-account',
        component: ActivateAccount,
        canActivate: [registerFlowGuard],
        title: 'Activar cuenta | DevVault'
    },
    {
        path: 'confirm-email/:token',
        component: ConfirmEmail,
        title: 'Confirmar correo | DevVault'
    },
    {
        path: 'suspended-account',
        component: SuspendedAccount,
        canActivate: [loginFlowGuard],
        title: 'Cuenta suspendida | DevVault'
    }
]

export default routes;