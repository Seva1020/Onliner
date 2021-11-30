import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from './category.component';
import { CategoryItemComponent } from './components/category-item/category-item.component';
import { CategoryRoutingModule } from './category-routing.module';
import { StoreModule } from '@ngrx/store';
import * as fromCategoryProducts from './state/reducers/category.reducers';
import { EffectsModule } from '@ngrx/effects';
import { CategoryEffects } from './state/effects/category.effects';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from 'src/app/shared/utils/utils';
import { HttpClient } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterComponent } from './components/filter/filter.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FilterItemComponent } from './components/filter-item/filter-item.component';

@NgModule({
    declarations: [
        CategoryComponent,
        CategoryItemComponent,
        FilterComponent,
        FilterItemComponent,
    ],
    imports: [
        CommonModule,
        CategoryRoutingModule,
        MatSelectModule,
        MatCheckboxModule,
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forFeature(
            fromCategoryProducts.categoryFeatureKey,
            fromCategoryProducts.reducer,
        ),
        EffectsModule.forFeature([CategoryEffects]),
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient],
            },
            useDefaultLang: false,
        }),
    ],
})
export class CategoryModule {}
