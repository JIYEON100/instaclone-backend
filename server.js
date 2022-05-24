require("dotenv").config();
import { ApolloServer } from "apollo-server";
import schema from "./schema";
import { getUser } from "./users/users.utils";

const PORT = process.env.PORT;
const server = new ApolloServer({
  schema,
  context: async({req}) => {
    return{
      loggedInUser: await getUser(req.headers.token),
    };
  },
});

server
  .listen(PORT)
  .then(() => console.log(`🚀Server is running on http://localhost:${PORT}✅`)
  );

  const x = (resolver) => (root, args, context, info) => {
    if(!context.loggedInUser){
      return{
        ok: false,
        error:"log in pls"
      }
    }
    return resolver(root, args, context, info);
  };