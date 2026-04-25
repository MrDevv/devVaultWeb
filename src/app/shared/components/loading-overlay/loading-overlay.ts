import { Component } from '@angular/core';
import { Loader } from "../loader/loader";

@Component({
  selector: 'loading-overlay',
  imports: [Loader],
  templateUrl: './loading-overlay.html'
})
export class LoadingOverlay {}
