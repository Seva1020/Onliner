import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import * as constants from './app-routing.constants';
import { AdminComponent } from './modules/admin/admin.component';
import { AdminModule } from './modules/admin/admin.module';
import { OrdersComponent } from './modules/admin/components/orders/orders.component';
import { ProfileContentComponent } from './modules/admin/components/profile-content/profile-content.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
    {
        path: `${constants.ADMIN}`,
        component: AdminComponent,
        children: [
            {
                path: '',
                redirectTo: `${constants.PROFILE}`,
                pathMatch: 'full',
            },
            {
                path: `${constants.PROFILE}`,
                component: ProfileContentComponent,
            },
            {
                path: `${constants.ORDERS}`,
                component: OrdersComponent,
            },
            {
                path: '**',
                redirectTo: `${constants.PROFILE}`,
                pathMatch: 'full',
            },
        ],
    },
    {
        path: constants.LOGIN,
        component: LoginComponent,
    },
    {
        path: `${constants.SIGN_IN}`,
        component: LoginComponent,
    },
    {
        path: `${constants.CART}`,
        loadChildren: () =>
            import('./modules/cart/cart.module').then(
                module => module.CartModule,
            ),
    },
    {
        path: `${constants.CATALOG}`,
        loadChildren: () =>
            import('./modules/catalog/catalog.module').then(
                module => module.CatalogModule,
            ),
    },
    {
        path: ``,
        loadChildren: () =>
            import('./modules/catalog/catalog.module').then(
                module => module.CatalogModule,
            ),
        pathMatch: 'full'
    },
    {
        path: `${constants.CATEGORY}`,
        loadChildren: () =>
            import('./modules/category/category.module').then(
                module => module.CategoryModule,
            ),
    },
    {
        path: constants.ERROR_PAGE,
        component: ErrorPageComponent,
    },
    {
        path: '**',
        redirectTo: constants.ERROR_PAGE,
    },
];

@NgModule({
    imports: [AdminModule, RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
