import React from "react";
import gql from "graphql-tag";
import { useQuery } from "react-apollo-hooks";

const PostsQuery = gql`
  query GET_PAGINATED_POSTS(
    $first: Int
    $last: Int
    $after: String
    $before: String
  ) {
    posts(first: $first, last: $last, after: $after, before: $before) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          id
          postId
          title
        }
      }
    }
  }
`;

// Function to update the query with the new results
const updateQuery = (previousResult, { fetchMoreResult }) => {
  return fetchMoreResult.posts.edges.length ? fetchMoreResult : previousResult;
};

// Component that shoes the paginated list of posts
const PostList = ({ data, error, loading, fetchMore }) => {
  const { posts } = data;
  return (
    <div>
      <h2>Post List</h2>
      {posts && posts.edges ? (
        <div>
          <ul>
            {posts.edges.map(edge => {
              const { node } = edge;
              return (
                <li
                  key={node.id}
                  dangerouslySetInnerHTML={{ __html: node.title }}
                />
              );
            })}
          </ul>
          <div>
            {posts.pageInfo.hasPreviousPage ? (
              <button
                onClick={() => {
                  fetchMore({
                    variables: {
                      first: null,
                      after: null,
                      last: 10,
                      before: posts.pageInfo.startCursor || null
                    },
                    updateQuery
                  });
                }}
              >
                Previous
              </button>
            ) : null}
            {posts.pageInfo.hasNextPage ? (
              <button
                onClick={() => {
                  fetchMore({
                    variables: {
                      first: 10,
                      after: posts.pageInfo.endCursor || null,
                      last: null,
                      before: null
                    },
                    updateQuery
                  });
                }}
              >
                Next
              </button>
            ) : null}
          </div>
        </div>
      ) : (
        <div>No posts were found...</div>
      )}
    </div>
  );
};

const Posts = () => {
  const variables = {
    first: 10,
    last: null,
    after: null,
    before: null
  };
  const { data, error, loading, fetchMore } = useQuery(PostsQuery, {
    variables
  });

  if (error) {
    return <pre>{JSON.stringify(error)}</pre>;
  }

  if (loading) {
    return null;
  }

  return (
    <PostList
      error={error}
      loading={loading}
      data={data}
      fetchMore={fetchMore}
    />
  );
};

export default () => <Posts />;
