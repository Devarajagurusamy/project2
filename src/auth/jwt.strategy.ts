// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor() {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: 'secretKey', // Use environment variable in production
//     });
//   }

//   async validate(payload: any) {
//     //console.log("PAYLOAD------------------>",payload);
//     return { id: payload.sub, name: payload.name };
//   }
// }

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        if (req && req.cookies) {
          return req.cookies['token']; // Replace 'token' with your cookie name
        }
        return null;
      },
      ignoreExpiration: false,
      secretOrKey: 'secretKey', // Use environment variable in production
    });
  }

  async validate(payload: any) {
    // console.log('PAYLOAD:', payload);
    return { id: payload.sub, name: payload.name }; // Include necessary user info
  }
}
