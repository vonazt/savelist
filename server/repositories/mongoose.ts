import { Schema, Document, model } from 'mongoose';

const TrackSchema = new Schema({
  track: String,
  album: String,
  artists: [String],
  spotifyId: String,
});

export const CollectiblesModel = model<Document>(`collectibles`, TrackSchema);

const TokensSchema = new Schema({
  accessToken: String,
  refreshToken: String
})

interface ITokensDocument extends Document {
  accessToken: string
  refreshToken: string
}

export const TokensModel = model<ITokensDocument>(`tokens`, TokensSchema)
