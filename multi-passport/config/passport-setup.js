const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const SamlStrategy = require('passport-saml').Strategy;
const User = require('../models/user-model');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  User.findById(userId).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/redirect',
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then((currentUser) => {
        if (currentUser) {
          console.log(profile);
          done(null, currentUser);
        } else {
          new User({
            username: profile.displayName,
            googleId: profile.id,
            thumbnail: profile._json.picture,
          })
            .save()
            .then((newUser) => {
              done(null, newUser);
            });
        }
      });
    }
  )
);

passport.use(
  new SamlStrategy(
    {
      entryPoint: process.env.ADFS_ENTRY_POINT,
      issuer: 'test',
      callbackUrl: process.env.ADFS_CALLBACK_URL,
      authnContext:
        'http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/password',
      acceptedClockSkewMs: -1,
      identifierFormat: null,
    },
    function (profile, done) {
      console.log('profile', profile);
      User.findOne({
        adfsUpn:
          profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn'],
      }).then((currentUser) => {
        if (currentUser) {
          done(null, currentUser);
        } else {
          new User({
            username:
              profile[
                'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
              ],
            adfsUpn:
              profile[
                'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn'
              ],
          })
            .save()
            .then((newUser) => {
              done(null, newUser);
            });
        }
      });
    }
  )
);
