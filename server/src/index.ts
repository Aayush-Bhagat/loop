import { ApolloServer, gql } from 'apollo-server';
import typeDefs from './schema'
import userResolver from './resolvers/users';



const resolvers = {
    Query: {
        ...userResolver.Query
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
