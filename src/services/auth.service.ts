import jwt from 'jsonwebtoken';
import { UserService } from './user.service';
import { IUser } from '../models/user.model';
import crypto from 'crypto';

export class AuthService {
  private userService: UserService;
  private readonly JWT_SECRET: string;

  constructor() {
    this.userService = new UserService();
    this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  }

  async signup(userData: {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    middlename: string;
  }): Promise<{ user: IUser; access_token: string }> {
    // Check if user already exists
    const existingUser = await this.userService.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Generate verification token
    const access_token = crypto.randomBytes(32).toString('hex');

    // Create new user
    const user = await this.userService.createUser({
      ...userData,
      accessToken: access_token,
      verified: true,
    });

    return { user, access_token };
  }

  async login(email: string, password: string): Promise<{
    user: IUser;
    accessToken: string;
  }> {
    // Find user
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check if user is verified
    // if (!user.verified) {
    //   throw new Error('Please verify your email first');
    // }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const accessToken = this.generateAccessToken(user);

    return {
      user,
      accessToken,
    };
  }

  private generateAccessToken(user: IUser): string {
    return jwt.sign(
      {
        userId: user._id,
        email: user.email,
        roles: user.roles,
      },
      this.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }
} 