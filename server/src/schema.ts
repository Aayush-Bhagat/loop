import { gql } from "apollo-server-express";

const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type User {
    id: Int!
    username: String!
    email: String! 
    displayName: String!
    followingCount: Int
    followerCount: Int 
    password: String!
    avatar: String
    bio: String 
    role: ROLE!
    genre: String 
    banner: String 
    contactEmail: String
    token: String
  }

  enum ROLE{
      LISTENER
      ARTIST
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    users(id:Int, username: String): [User!]
  }

  type Mutation{
    register(email: String, username: String, password: String, role: String, displayName: String): User
    login(username: String, password: String): User
  }
`

export default typeDefs