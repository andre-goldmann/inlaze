import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {
  title: string = '';
  content: string = '';


  closeDialog() {
  }

  submitForm() {
    // Add logic to handle form submission (e.g., sending data to the server)
    console.log('Form submitted:', { title: this.title, content: this.content });

  }
}
