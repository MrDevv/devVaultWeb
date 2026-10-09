import { Routes } from "@angular/router";
import { NewProfessionalTechnology } from "./professional-technologies/pages/new-professional-technology/new-professional-technology";

import { HomePage } from "./home/pages/home-page/home-page";
import { ListExperience } from "./experience/pages/list-experience/list-experience";
import { NewExperience } from "./experience/pages/new-experience/new-experience";
import { ListProjects } from "./projects/pages/list-projects/list-projects";
import { NewProject } from "./projects/pages/new-project/new-project";
import { DevVaultAdministrativaLayout } from "./shared/layouts/dev-vault-administrativa-layout/dev-vault-administrativ-layout";
import { ProfessionalData } from "./professional-data/pages/professional-data/professional-data";
import { EditProfessionalData } from "./professional-data/pages/edit-professional-data/edit-professional-data";

import { EditExperience } from "./experience/pages/edit-experience/edit-experience";
import { EditProject } from "./projects/pages/edit-project/edit-project";
import { ListProfessionalTechnologies } from "./professional-technologies/pages/list-professional-technologies/list-professional-technologies";
import { EditProfessionalTechnology } from "./professional-technologies/pages/edit-professional-technology/edit-professional-technology";

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
                path: 'technologies',
                children: [
                    {
                        path: '',
                        component: ListProfessionalTechnologies
                    },
                    {
                        path: 'new-technology',
                        component: NewProfessionalTechnology
                    },
                    {
                        path: ':uuid',
                        component: EditProfessionalTechnology
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
                    {
                        path: ':uuid',
                        component: EditExperience
                    }
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
                    {
                        path: ':uuid',
                        component: EditProject
                    }
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