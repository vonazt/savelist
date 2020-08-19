import { repository } from '../repositories';
import { AuthenticationError } from 'apollo-server-express';

const authMiddleware = async (
  prevAccessToken: string,
  refreshToken: string,
): Promise<string> => {
  const accessToken = await repository.validateToken(prevAccessToken, refreshToken);
  if (!accessToken) {
    throw new AuthenticationError(
      `Access token and refresh token have expired - please login to Spotify again`,
    );
  }
  return accessToken;
};

export default authMiddleware;
