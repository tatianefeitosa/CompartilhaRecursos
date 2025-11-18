import passport from "passport";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from "passport-jwt";

import { AppDataSource } from "./database";
import { User } from "../entities/user";
import { TokenBlacklist } from "../entities/TokenBlacklist";

const SECRET_KEY = process.env.JWT_SECRET || "sua-chave-secreta-super-segura";

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET_KEY,
};

passport.use(
  new JwtStrategy(options, async (payload, done) => {
    try {
      // Verificar se o token está na blacklist
      const blacklistedToken = await AppDataSource.getRepository(
        TokenBlacklist
      ).findOne({
        where: { token: payload.token },
      });

      if (blacklistedToken) {
        return done(null, false);
      }
      // Buscar usuário
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { id: payload.id },
      });
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;
