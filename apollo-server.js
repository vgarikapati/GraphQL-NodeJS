const { ApolloServer, gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.
  # This "Book" type defines the queryable fields for every book in our data source.

  type Book {
    isbn: Int
    title: String
    author: String
    yearPublished: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).

  type Query {
    books: [Book]
  }
`;

const books = [
    {
      isbn: 10050,
      title: 'Harry Potter',
      author: 'J.K. Rowling',
      yearPublished: '12/25/2015'
    },
    {
      isbn: 10051,
      title: 'Jurassic Park',
      author: 'Michael Crichton',
      yearPublished: '01/07/2012'
    },
    {
        isbn: 10052,
        title: 'Lord of the Rings',
        author: 'Lory Mitchell',
        yearPublished: '01/07/2012'
    },
    {
        isbn: 10053,
        title: 'Yello Cave',
        author: 'Richard Bond',
        yearPublished: '01/07/2012'
    }
  ];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
      books: () => books,
    },
  };

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`Apollo 🚀 GraphQL Server ready at ${url}`);
});

