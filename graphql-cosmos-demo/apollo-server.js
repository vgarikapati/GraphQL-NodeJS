require('dotenv').config()
const { ApolloServer, gql } = require('apollo-server')
const { CosmosClient } = require('@azure/cosmos')

const client = new CosmosClient({
  endpoint: process.env.ENDPOINT,
  key: process.env.KEY
})

const container = client
  .database(process.env.DATABASE)
  .container(process.env.CONTAINER)

const typeDefs = gql`

type Plan {
  id: ID!
  sourceSystemCode: String
  sourceSystemInstance: String
  planCodeEffDateInsKey: String
  planCode: String
  planName: String
  planTypeCode: String
  planEffDate: String
  planTermDate: String
  planVerifyMemberInd: String
}

type Query {
  getAllPlans: [Plan]
  planSearchById(id: ID!, partitionKey: String!): Plan
  planSearchByKey(planKey: String!): [Plan]
}

type Mutation {
  createPlan(
    sourceSystemCode: String, 
    sourceSystemInstance: String, 
    planCodeEffDateInsKey: String!, 
    planCode: String,
    planName: String,
    planTypeCode: String,
    planEffDate: String,
    planTermDate: String,
    planVerifyMemberInd: String
    ): Plan

  deletePlan(id: ID!, partitionKey: String!) : Plan

  updatePlan(
    sourceSystemCode: String, 
    sourceSystemInstance: String,
    planCodeEffDateInsKey: String!,
    planCode: String,
    planName: String,
    planTypeCode: String,
    planEffDate: String,
    planTermDate: String,
    planVerifyMemberInd: String,
    id: ID!
  ): Plan
}
`
const resolvers = {
  Query: {
    getAllPlans: async () => {
      const response = await container.items.query('SELECT * FROM c').fetchAll()
      //console.log(response.resources)
      return response.resources
    },
    planSearchById : async (root, { id, partitionKey }) => {
      const response = await container.item(id, partitionKey).read()
      //console.log(response.resource)
      return response.resource
    }, 
    planSearchByKey : async(root, {planKey}) => {

      console.log(`Plan Key : ${planKey}`)
      try {

        const response = await container.items.query({
          query: "SELECT * FROM c WHERE c.planCodeEffDateInsKey IN (@planKey)",
          parameters : [{name : "@planKey", value : planKey}]
        }).fetchAll()

        console.log(response.resources)
        //return JSON.parse(JSON.stringify(response.resources))
        return response.resources

      } catch(error) {
        console.log("PlanSearchByKey - Execution Error : " + error)
      }
    }
  },
  Mutation: {
    createPlan: async (root, args) => {
      const response = await container.items.create(args) 
      return response.resource
    },
    deletePlan: async (id, partitionKey) => {
      //console.log(id)
      //console.log(partitionKey)
      await container.item(id, partitionKey).delete
    },
    updatePlan: async (root, args) => {
      await container.item(args.id, args.planCodeEffDateInsKey).replace(args)
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers })
server.listen().then(({ url }) => {
  console.log(`Apollo 🚀 Server connected to Azure Cosmos DB and ready at ${url}`)
  console.log(`GrphQL IDE can be accessed through ${url} or ${url}graphiql`)
})