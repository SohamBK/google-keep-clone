// src/modules/auth/google.routes.ts
import express from "express";
import passport from "passport";
import "../../api/auth/google.strategy";
import { generateAndSetTokens } from "../../helper/auth.helper";

const router = express.Router();

// Start Google OAuth2 flow
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// Callback route Google redirects to
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  async (req: express.Request, res: express.Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    try {
      const User = (await import("../../models/user.model")).default;
      const normalized = req.user as { id: string; email: string };

      const userDoc = await User.findById(normalized.id);
      if (!userDoc) {
        return res.status(500).json({ message: "User record not found" });
      }

      const { accessToken } = generateAndSetTokens(res, userDoc as any);

      // In dev: redirect with token in query. In prod: prefer HTTP-only cookie already set by helper.
      const redirectTo = process.env.FRONTEND_URL || "http://localhost:3000";
      res.redirect(`${redirectTo}/login-success?token=${accessToken}`);
    } catch (err) {
      console.error("Error in google callback:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;
