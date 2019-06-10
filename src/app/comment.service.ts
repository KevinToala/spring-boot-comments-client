import { Injectable } from '@angular/core';
import {Apollo} from "apollo-angular";
import gql from "graphql-tag";
import {Observable} from "rxjs";
import {Comment} from "./comment";
import {ApolloQueryResult} from "apollo-client";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private apollo: Apollo) {
  }

  public saveComment(comment: string): Observable<Comment> {
    return this.apollo.mutate({
      mutation: gql`
        mutation saveComment($content: String!) {
          saveComment(content: $content) {
            id
            content
          }
        }`,
      variables: {
        content: comment
      }
    });
  }

  public getAll(): Observable<ApolloQueryResult<{allComments: Comment[]}>> {
    return this.apollo.query({
      query: gql`
        query allComments {
          allComments {
            id
            content
          }
        }`
    });
  }

  public getById(id: string): Observable<ApolloQueryResult<Comment[]>> {
    return this.apollo.query({
      query: gql`
        mutation getComment($id: String) {
          getComment(id: $id) {
            id
            content
          }
        }`,
      variables: {
        id: id
      }
    });
  }

  public subscribeSaveComment(): Observable<Comment> {
    return this.apollo.subscribe({
      query: gql`
        subscription onSaveComment {
          onSaveComment {
            id
            content
          }
        }`
    }).pipe(map(response => response.data.onSaveComment));
  }
}
