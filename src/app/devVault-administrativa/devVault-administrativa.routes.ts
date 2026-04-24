import { Routes } from "@angular/router";

import { HomePage } from "./home/pages/home-page/home-page";
import { ListExperience } from "./experience/pages/list-experience/list-experience";
import { NewExperience } from "./experience/pages/new-experience/new-experience";
import { ListProjects } from "./projects/pages/list-projects/list-projects";
import { NewProject } from "./projects/pages/new-project/new-project";
import { DevVaultAdministrativaLayout } from "./shared/layouts/dev-vault-administrativa-layout/dev-vault-administrativ-layout";
import { ProfessionalData } from "./professional-data/pages/professional-data/professional-data";
import { EditProfessionalData } from "./professional-data/pages/edit-professional-data/edit-professional-data";

export const routes: Routes = [
    {
        path: '',
        component: DevVaultAdministrativaLayout,
        children: [
            {
                path: 'home',
                component: HomePage
            },
            {
                path: 'professional-data',
                children: [
                    {
                        path: '',
                        component: ProfessionalData
                    },
                    {
                        path: ':uuid',
                        component: EditProfessionalData
                    }
                ]
            },
            {
                path: 'experience',
                children: [
                    {
                        path: '',
                        component: ListExperience
                    },
                    {
                        path: 'new-experience',
                        component: NewExperience
                    },
                ]
            },
            {
                path: 'projects',
                children: [
                    {
                        path: '',
                        component: ListProjects
                    },
                    {
                        path: 'new-project',
                        component: NewProject
                    },
                ]
            },
            {
                path: '**',
                redirectTo: 'home'
            }
        ]
    }
]

export default routes;