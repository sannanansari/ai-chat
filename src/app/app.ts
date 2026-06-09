import { ChangeDetectionStrategy, ChangeDetectorRef, Component, signal } from '@angular/core';
import { ChatService } from './services/chat';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule,MarkdownModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {

  title = '';
  question = '';
  answer = signal('');
  loading = signal(false);
  error = signal('');

  constructor(private chat: ChatService, private cdr: ChangeDetectorRef) {}

  // ask() {
  //   if (!this.question.trim()) return;

  //   this.loading.set(true);
  //   this.answer.set('');
  //   this.error.set('');

  //   this.chat.ask(this.question).subscribe({
  //     next: (res) => {
  //       this.answer.set(res.answer);
  //       console.log(this.answer)
  //       this.loading.set(false);
  //       console.log(this.loading)
  //       // this.cdr.markForCheck();
  //     },
  //     error: () => {
  //       this.error.set('Something went wrong. Try again.');
  //       this.loading.set(false);
  //     }
  //   });
  // }

    ask() {
    if (!this.question.trim()) return;

    this.loading.set(true);
    this.answer.set('');
    this.error.set('');

    this.chat.stream(this.question).subscribe({
      next: (chunk) => {
        this.answer.update(current => current + chunk);
        console.log(this.answer())
        this.cdr.markForCheck()
      },
      error: () => {
        this.error.set('Something went wrong. Try again.');
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
        console.log(this.loading()
        )
      }
    });
  }

}