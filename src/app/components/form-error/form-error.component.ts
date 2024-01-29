import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-error',
  templateUrl: './form-error.component.html',
  styleUrls: ['./form-error.component.scss'],
  animations: [
    trigger("label", [
      transition(":enter", [
        style({ transform: "translateY(-100%)" }),
        animate("80ms ease-out"),
      ]),
      transition(":leave", [
        animate("80ms ease-in", style({ transform: "translateY(-100%)" })),
      ]),
    ]),
  ],
})
export class FormErrorComponent  implements OnInit {
  constructor() {}
  @Input() showError: boolean | undefined;
  @Input() errorMessage: string | undefined;

  ngOnInit() {}
}
