import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const DB_NAME = "landmark";
const USERNAME = "geekMukh";
const PASSWORD = "Kv1NkxqR5Sk2oEx9";
const CONNECTION_STRING_SCHEME = "mongodb+srv";
const HOST_NAME = "geekmukh.oniuy8o.mongodb.net";
const CONNECTION_STRING = `${CONNECTION_STRING_SCHEME}://${USERNAME}:${PASSWORD}@${HOST_NAME}/${DB_NAME}?retryWrites=true&w=majority`;

mongoose
  .connect(CONNECTION_STRING)
  .then((db) => console.log(`connected to ${DB_NAME} database`))
  .catch((err) => console.log(err));

export default mongoose;