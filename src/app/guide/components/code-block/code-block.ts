import { AfterViewInit, Component, input } from '@angular/core';
import Prism from 'prismjs';

import 'prismjs/components/prism-json'
import 'prismjs/components/prism-javascript';

@Component({
  selector: 'code-block',
  imports: [],
  templateUrl: './code-block.html',  
})
export class CodeBlock implements AfterViewInit{
  text = input.required<string>();  
  type = input<string>();

  isJson(): boolean {
    return this.type() == 'json';
  }

  isJavascript(): boolean {    
    return this.type() == 'javascript';
  }
  
  ngAfterViewInit(): void {
    Prism.highlightAll();
  }
}
