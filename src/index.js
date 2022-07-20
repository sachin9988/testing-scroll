import React from "react";
import ReactDOM from "react-dom";

import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";
import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";

import PostList from "./list";

const client = new ApolloClient({
  link: new HttpLink({
    uri: `https://content.wpgraphql.com/graphql`
  }),
  cache: new InMemoryCache()
  // for SSR, use:
  // cache: new Cache().restore(window.__APOLLO_STATE__ || {})
});

const App = () => (
  <ApolloProvider client={client}>
    <ApolloHooksProvider client={client}>
      <div>
        <PostList />
      </div>
    </ApolloHooksProvider>
  </ApolloProvider>
);

ReactDOM.render(<App />, document.getElementById("root"));
