import { model, Schema, Document, Model } from 'mongoose';
import { Baby } from '../models';

const BabySchema = new Schema({
  name: String,
  height: Number,
  weight: Number,
  dob: Date,
});

export interface BabyDocument extends Document {
  name: string;
  height: number;
  weight: number;
  dob: Date;
}

export const create = async (baby: Baby): Promise<BabyDocument> => {
  const BabyModel = await model<BabyDocument>(`Baby`, BabySchema);
  const babyToSave = new BabyModel(baby);
  await babyToSave.save();
  const newBaby = (await BabyModel.findOne({ _id: babyToSave._id }, null, {
    lean: true,
  })) as BabyDocument;
  return newBaby;
};
