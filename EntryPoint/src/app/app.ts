import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./header/header";
import { Body } from "./body/body";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Body],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('EntryPoint');
}
