import querystring from 'querystring';
import { RequestHandler } from 'express';
import axios from 'axios';
import qs from 'qs';
import { repository } from '../repositories';

export const login: RequestHandler = (req, res): void =>
  res.redirect(
    `https://accounts.spotify.com/authorize?${querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: `user-read-private 
           user-read-email 
           user-top-read 
           playlist-modify-public 
           playlist-modify-private 
           playlist-read-private
           playlist-read-collaborative
          `,
      redirect_uri: process.env.REDIRECT_URI,
    })}`,
  );

export const callback: RequestHandler = async (req, res) => {
  const code = req.query.code || null;

  const data = {
    code,
    redirect_uri: process.env.REDIRECT_URI,
    grant_type: 'authorization_code',
  };
  const {
    data: { access_token, refresh_token },
  } = await axios({
    method: `POST`,
    url: `https://accounts.spotify.com/api/token`,
    data: qs.stringify(data),
    headers: {
      Authorization: `Basic ${process.env.SPOTIFY_AUTH_SECRET}`,
      'content-type': 'application/x-www-form-urlencoded',
    },
  });

  await repository.saveTokens(access_token, refresh_token)

  const query = querystring.stringify({ access_token });
  res.redirect(`${process.env.FRONT_END_URI}?${query}`);
};

export const refresh: RequestHandler = async (req, res) => {
  const data = {
    refresh_token: req.body.refresh_token,
    grant_type: 'refresh_token',
  };

  const {
    data: { access_token },
  } = await axios({
    method: `POST`,
    url: `https://accounts.spotify.com/api/token`,
    data: qs.stringify(data),
    headers: {
      Authorization: `Basic ${process.env.SPOTIFY_AUTH_SECRET}`,
      'content-type': 'application/x-www-form-urlencoded',
    },
  });

  const query = querystring.stringify({ access_token });
  res.redirect(`${process.env.FRONT_END_URI}?${query}`);
};
