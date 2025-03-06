require("dotenv").config();
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const axios = require("axios");

const app = express();
const MONDAY_API_URL = "https://api.monday.com/v2";
const API_KEY = process.env.MONDAY_API_KEY;


const schema = buildSchema(`
  type Board {
    id: ID!
    name: String!
  }

  type Mutation {
    createBoard(name: String!): Board
  }

  type Query {
    boards: [Board]
  }
`);

const root = {
  boards: async () => {
    const response = await axios.post(
      MONDAY_API_URL,
      { query: `{ boards { id name } }` },
      { headers: { Authorization: API_KEY } }
    );
    return response.data.data.boards;
  },

  createBoard: async ({ name }) => {
    const response = await axios.post(
      MONDAY_API_URL,
      { query: `mutation { create_board (board_name: "${name}", board_kind: public) { id name } }` },
      { headers: { Authorization: API_KEY } }
    );
    return response.data.data.create_board;
  }
};

app.use("/graphql", graphqlHTTP({ schema, rootValue: root, graphiql: true }));

app.listen(4000, () => console.log("🚀 Server running at http://localhost:4000/graphql"));
