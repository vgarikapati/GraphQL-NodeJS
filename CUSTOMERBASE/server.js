const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema');

const app = express();

app.use('/graphql', expressGraphQL({
    schema:schema,
    graphiql:true
}));

app.listen(4004, () => {
    console.log('GraphQL server is started and running on port 4004')
}) 