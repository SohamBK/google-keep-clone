// src/modules/auth/google.strategy.ts
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import User from "../../models/user.model";
import dotenv from "dotenv";
dotenv.config();

const clientID = process.env.GOOGLE_CLIENT_ID!;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
const callbackURL = process.env.GOOGLE_CALLBACK_URL!;

passport.use(
  new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL,
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done
    ) => {
      try {
        const email = profile.emails?.[0]?.value;
        const googleId = profile.id;

        if (!email) {
          return done(new Error("Google account has no email"), false);
        }

        // find by googleId or email
        let user = await User.findOne({ $or: [{ googleId }, { email }] });

        if (!user) {
          // create user (password optional)
          user = await User.create({
            email,
            googleId,
            provider: "google",
            isActive: true,
            isDeleted: false,
          });
        } else if (!user.googleId) {
          // link googleId to an existing user (registered via local)
          user.googleId = googleId;
          user.provider = "google";
          await user.save();
        }

        // pass a normalized object to req.user so existing controllers don't break
        return done(null, { id: user._id.toString(), email: user.email });
      } catch (err) {
        console.error("Google strategy error:", err);
        return done(err as Error, false);
      }
    }
  )
);

export default passport;
