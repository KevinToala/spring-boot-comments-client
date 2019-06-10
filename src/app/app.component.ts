import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {CommentService} from "./comment.service";
import {Comment} from "./comment";
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  comments: Comment[] = [];
  newComment: string = null;

  showSpinner = true;
  todoSubscription: Subscription;

  constructor(private commentService: CommentService) {
  }

  ngOnInit(): void {
    this.commentService.getAll()
      .pipe(finalize(() => this.showSpinner = false))
      .subscribe(response => this.comments = response.data.allComments);

    this.todoSubscription = this.commentService.subscribeSaveComment()
      .subscribe(newComment => this.comments = [...this.comments, newComment]);
  }

  ngOnDestroy() {
    this.todoSubscription.unsubscribe();
  }

  sendComment(): void {
    if (this.newComment) {
      this.commentService.saveComment(this.newComment)
        .subscribe(response => this.newComment = null);
    }
  }
}
