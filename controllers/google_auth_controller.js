const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User_Model');
const { signAccessToken, signRefreshToken } = require('../utils/jwt_helper');

module.exports = {
  googleAuth: async (req, res, next) => {
    try {
      const code = req.query.code;
      const oAuth2Client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.REDIRECT_URL
      );
      if (!code) {
        const oAuth2Client = new OAuth2Client(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          process.env.REDIRECT_URL
        );
        const authorizeUrl = oAuth2Client.generateAuthUrl({
          access_type: 'offline',
          prompt: 'consent',
          scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
          ],
        });
        res.redirect(authorizeUrl);
      } else {
        const r = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(r.tokens);
        const url = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json';
        const result = await oAuth2Client.request({ url });

        const user = await User.findOneAndUpdate(
          { email: result.data.email },
          result.data,
          { upsert: true, returnDocument: 'after' }
        )
          .lean()
          .exec();

        const { _id } = user;

        const accessToken = await signAccessToken(_id);
        const refreshToken = await signRefreshToken(_id);

        res.cookie('AccessTokenCookie', accessToken, {
          sameSite: 'strict',
          // secure: true, IN Https only
          httpOnly: true,
          maxAge: 900000, //15m
        });

        res.cookie('RefreshTokenCookie', refreshToken, {
          sameSite: 'strict',
          // secure: true, IN Https only
          httpOnly: true,
          maxAge: 604800000, //7d
        });

        res.send('Successfull login');
      }
    } catch (error) {
      next(error);
    }
  },
};
