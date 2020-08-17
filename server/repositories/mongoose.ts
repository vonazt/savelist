import { Schema, Document, model } from 'mongoose';

const TrackSchema = new Schema({
  track: String,
  album: String,
  artists: [String],
  spotifyId: String,
});

export const CollectiblesModel = model<Document>(`collectibles`, TrackSchema);
