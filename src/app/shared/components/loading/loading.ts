import { Component } from '@angular/core';
import { Loader } from "../loader/loader";

@Component({
  selector: 'loading',
  imports: [Loader],
  templateUrl: './loading.html',
})
export class Loading {}
