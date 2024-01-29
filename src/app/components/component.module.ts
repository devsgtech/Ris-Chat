import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FormErrorComponent } from "./form-error/form-error.component";

@NgModule({
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    ReactiveFormsModule,
  ],
  declarations: [FormErrorComponent],
  exports: [FormErrorComponent],
})
export class ComponentModule {}
