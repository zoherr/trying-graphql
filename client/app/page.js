"use client"
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:8080/graphql",
  cache: new InMemoryCache(),
});

const GET_ALL_USERS = gql`
  query getAllUser {
    getAllUsers {
      id
      name
    }
  }
`;

function UsersList() {
  const { loading, error, data } = useQuery(GET_ALL_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.getAllUsers.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <ApolloProvider client={client}>
      <div>
        <h1>Users</h1>
        <UsersList />
      </div>
    </ApolloProvider>
  );
}
