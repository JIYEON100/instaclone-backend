import bcrypt from "bcrypt";
import client from "../../client"
import { protectedResolver } from "../users.utils";

const resolverFn = async (_, {
  firstName,
  lastName,
  username,
  email,
  location,
  avatarURL,
  githubUsername,
  password:newPassword,
},
{ loggedInUser }
) => {
  let uglyPassword = null;
  if(newPassword){
    uglyPassword = await bcrypt.hash(newPassword, 10);
  }
  const updatedUser = await client.user.update({
    where:{
      id: loggedInUser.id,
    }, 
    data: {
      firstName, 
      lastName, 
      username, 
      email,
      location,
      avatarURL,
      githubUsername, 
      ...(uglyPassword && {password: uglyPassword}),
    },
  });
  if(updatedUser.id){
    return{
      ok: true,
    }
  } else{
    return{
      ok: false,
      // error: "Could not update profile.",
      error: $error,
    };
  }
};

export default {
  Mutation: {
    editProfile: protectedResolver(resolverFn),
  },
};