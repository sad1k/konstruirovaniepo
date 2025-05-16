import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';  // Add this import
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { JwtStrategy } from './strategies/jwt.strategy';  // Add this import

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    PassportModule,  // Add this line
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'asdqweasdqweasdqweasd',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],  // Add JwtStrategy here
  exports: [AuthService],
})
export class AuthModule {}