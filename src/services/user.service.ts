import { User, IUser } from '../models/user.model';
// import { Types } from 'mongoose';

export class UserService {
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return await User.findOne({ username });
  }

  async updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  async deleteUser(id: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(id);
  }

  async updateRefreshToken(id: string, refreshToken: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      id,
      { refreshToken },
      { new: true }
    );
  }

  async verifyUser(verificationToken: string): Promise<IUser | null> {
    return await User.findOneAndUpdate(
      { verificationToken },
      { 
        $set: { 
          verified: true,
          verificationToken: null
        }
      },
      { new: true }
    );
  }
} 