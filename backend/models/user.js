import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";

const Schema = mongoose.Schema;

let usersSchema = new Schema(
    {
      name: {
        type: String,
        default: null,
      },
      locale: {
        type: String,
        default: null,
      },
      email: {
        type: String,
        unique: true,
        default: null,
      },
      password: {
        type: String,
        default: null,
      },
      password_token: {
        type: String,
      },
      phone_number: {
        type: String,
        default: null,
      },
      gender: {
        type: String,
        default: null,
      },
      is_active: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );
  usersSchema.plugin(mongooseDelete, {
    deletedAt: true,
  });
  
  
  export default mongoose.model("users", usersSchema);