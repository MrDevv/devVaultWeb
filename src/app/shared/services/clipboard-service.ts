import { Injectable } from "@angular/core";
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root',
})
export class ClipboardService {

    async copyToClipboard(text: string, title: string): Promise<void> {
      await navigator.clipboard.writeText(text);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `${title} copiado en el portapapeles.`,
        showConfirmButton: false,
        timer: 1500
      });
    }
}