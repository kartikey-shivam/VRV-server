import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import env from './env'
import User from '../models/User'

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  //@ts-ignore
  done(null, user)
})

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.APP_URL + '/api/auth/google/callback',
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        //@ts-ignore
        const { userType } = JSON.parse(decodeURIComponent(request.query.state))
        let user = await User.findOne({ email: profile._json.email })
        if (!user) {
          user = await User.create({
            email: profile._json.email,
            firstName: profile._json.family_name,
            lastName: profile._json.given_name,
            avatar: profile._json.picture,
            role: userType,
            emailVerified: true,
          })
        }
        if (!user.emailVerified) {
          user.emailVerified = true
          await user.save()
        }
        return done(null, user)
      } catch (error) {
        console.log(error)
        return done(null, profile)
      }
    }
  )
)
export default passport
