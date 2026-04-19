import { Routes } from "@angular/router";

import { LoginPage } from "./pages/login-page/login-page";
import { RegisterPage } from "./pages/register/register-page";

export const routes: Routes = [
    {
        path: 'login',
        component: LoginPage
    },
    {
        path: 'register',
        component: RegisterPage
    }
]

export default routes;