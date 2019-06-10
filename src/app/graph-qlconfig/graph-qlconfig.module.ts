import { NgModule } from '@angular/core';
import {Apollo, ApolloModule} from "apollo-angular";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {WebSocketLink} from "apollo-link-ws";
import {split} from "apollo-link";
import {getMainDefinition} from "apollo-utilities";
import {InMemoryCache} from "apollo-cache-inmemory";
import {HttpLink, HttpLinkModule} from "apollo-angular-link-http";

@NgModule({
  exports: [HttpClientModule, ApolloModule, HttpLinkModule]
})
export class GraphQLConfigModule {

  constructor(
    private apollo: Apollo,
    private httpClient: HttpClient
  ) {
    const httpLink = new HttpLink(httpClient).create({
      uri: 'http://localhost:8080/graphql'
    });

    const subscriptionLink = new WebSocketLink({
      uri: 'ws://localhost:8080/subscriptions',
      options: {
        reconnect: true,
      }
    });

    const link = split(
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      subscriptionLink,
      httpLink
    );

    apollo.create({
      link: link,
      cache: new InMemoryCache()
    });
  }
}
