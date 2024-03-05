import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FormErrorComponent } from "./form-error/form-error.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule.forRoot(),
    ReactiveFormsModule,
  ],
  declarations: [FormErrorComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  exports: [FormErrorComponent],
})
export class ComponentModule {}
