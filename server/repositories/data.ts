import { model, Schema, Document, Model } from 'mongoose';
import { Data, UpdateData } from '../models';

const DataSchema = new Schema({
  name: String,
  age: Number,
});

export interface DataDocument extends Document {
  name: string;
  age: number;
}

const connectToSchema = async <T extends Document>(
  collection: string,
  schema: Schema,
): Promise<Model<T>> => model<T>(collection, schema);

export const list = async (): Promise<DataDocument[]> => {
  const DataModel = await connectToSchema(`Data`, DataSchema);
  const data = (await DataModel.find({}, null, {
    lean: true,
  })) as DataDocument[];
  return data;
};

export const create = async (data: Data): Promise<DataDocument> => {
  const DataModel = await connectToSchema(`Data`, DataSchema);
  const dataToSave = new DataModel(data);
  await dataToSave.save();
  const newData = (await DataModel.findOne({ _id: dataToSave._id }, null, {
    lean: true,
  })) as DataDocument;
  return newData;
};

export const update = async (
  _id: string,
  data: UpdateData,
): Promise<DataDocument> => {
  const DataModel = await connectToSchema(`Data`, DataSchema);
  const updatedData = (await DataModel.findByIdAndUpdate({ _id }, data, {
    new: true,
    lean: true,
  })) as DataDocument;
  return updatedData;
};

export const deleteOne = async (_id: string): Promise<string> => {
  const DataModel = await connectToSchema(`Data`, DataSchema);
  const deleteResult = (await DataModel.findByIdAndDelete({
    _id,
  })) as DataDocument;
  return `Successfully deleted ${deleteResult.name}`;
};
