// import { Schema } from 'mongoose';

// export const UserSchema = new Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   password: { type: String },
// });

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop()
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  password?: string;

  @Prop()
  picture: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

