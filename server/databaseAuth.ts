import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { storage } from './databaseStorage';
import { sendEmail } from './services/emailService';

const emailVerificationTokens = new Map<string, { email: string, token: string, expires: Date }>();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-for-development';

export const databaseAuth = {
  async createUser(userData: any) {
    try {
      const user = await storage.createUser({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        name: userData.name || null,
        role: userData.role || 'user',
        isActive: true,
        emailVerified: false,
      });
      
      // Generate email verification token
      const verificationToken = this.generateEmailVerificationToken(user.email);
      
      return { user, verificationToken };
    } catch (error) {
      throw new Error('Failed to create user: ' + (error as Error).message);
    }
  },

  async getUserByEmail(email: string) {
    try {
      return await storage.getUserByEmail(email);
    } catch (error) {
      return null;
    }
  },

  async getUserById(id: number) {
    try {
      return await storage.getUserById(id);
    } catch (error) {
      return null;
    }
  },

  async verifyPassword(plainPassword: string, hashedPassword: string) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  async authenticate(email: string, password: string) {
    console.log('Authenticating user:', email);
    
    const user = await this.getUserByEmail(email);
    console.log('User found:', user ? { id: user.id, email: user.email, role: user.role } : 'null');
    
    if (!user) {
      console.log('User not found in database');
      return null;
    }

    console.log('Verifying password for user:', user.email);
    const isValid = await this.verifyPassword(password, user.password);
    console.log('Password verification result:', isValid);
    
    if (!isValid) {
      console.log('Password verification failed');
      return null;
    }

    // Skip email verification for admin users
    if (!user.emailVerified && user.role !== 'admin') {
      throw new Error('Email not verified. Please check your email and verify your account before logging in.');
    }

    // Update last login
    await storage.updateUser(user.id, { lastLogin: new Date() });

    console.log('Authentication successful for user:', user.email);
    return user;
  },

  generateToken(userId: number) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  },

  verifyToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  },

  generateEmailVerificationToken(email: string) {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expires = new Date();
    expires.setHours(expires.getHours() + 24); // 24 hours

    emailVerificationTokens.set(token, { email, token, expires });
    return token;
  },

  async verifyEmailToken(token: string) {
    console.log('Verifying email token:', token);
    const tokenData = emailVerificationTokens.get(token);
    console.log('Token data found:', tokenData ? 'Yes' : 'No');
    
    if (!tokenData) {
      console.log('Token not found in memory store');
      return false;
    }

    if (new Date() > tokenData.expires) {
      console.log('Token has expired');
      emailVerificationTokens.delete(token);
      return false;
    }

    // Mark user as verified
    console.log('Updating user verification status for email:', tokenData.email);
    const user = await this.getUserByEmail(tokenData.email);
    if (user) {
      console.log('User found, updating verification status');
      await storage.updateUser(user.id, { 
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null
      });
      console.log('User verification status updated successfully');
    } else {
      console.log('User not found for email:', tokenData.email);
    }

    emailVerificationTokens.delete(token);
    return true;
  },

  async updatePassword(userId: number, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await storage.updateUser(userId, { 
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null
    });
  },

  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/api/auth/verify-email?token=${token}`;
    
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Hire Mzansi!</h2>
        <p>Thank you for creating your account. Please verify your email address to complete your registration.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          If you didn't create an account with Hire Mzansi, you can safely ignore this email.
        </p>
        <p style="color: #666; font-size: 14px;">
          This verification link will expire in 24 hours.
        </p>
      </div>
    `;

    try {
      await sendEmail({
        to: email,
        subject: "Verify your Hire Mzansi account",
        html: emailContent
      });
      return true;
    } catch (error) {
      console.error('Failed to send verification email:', error);
      return false;
    }
  },

  async getAllUsers() {
    try {
      return await storage.getAllUsers();
    } catch (error) {
      return [];
    }
  },

  // Initialize admin user in database
  async initializeAdminUser() {
    try {
      const existingAdmin = await this.getUserByEmail('deniskasala17@gmail.com');
      if (!existingAdmin) {
        const adminUser = await storage.createUser({
          username: 'admin',
          email: 'deniskasala17@gmail.com',
          password: await bcrypt.hash('@Deniskasala2025', 12), // @Deniskasala2025
          name: 'Denis Kasala',
          role: 'admin',
          isActive: true,
          emailVerified: true,
        });
        console.log('Admin user created in database');
        return adminUser;
      }
      return existingAdmin;
    } catch (error) {
      console.error('Failed to initialize admin user:', error);
      return null;
    }
  }
};

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const decoded = databaseAuth.verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  (req as any).user = decoded;
  next();
};