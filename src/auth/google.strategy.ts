import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(private configService: ConfigService) {
      super({
      clientID: "20961636685-ef7b6atj562vtj8uunbuchppidd2q3u6.apps.googleusercontent.com", // ✅ Replace with actual Client ID
      clientSecret: "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", // ✅ Replace with actual Secret
      callbackURL: "http://localhost:3000/auth/google/redirect",
      scope: ["email", "profile"],
    });
  }

    
    
  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const user = {
      googleId: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      picture: profile.photos[0].value,
      accessToken,
      };
      console.log("Google Client ID:", this.configService.get<string>("GOOGLE_CLIENT_ID"));


    done(null, user);
  }
}
