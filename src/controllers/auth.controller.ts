import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { validationResult } from "express-validator";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  signup = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("Signup request received:", req.body);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("Validation errors:", errors.array());
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, password, firstname, middlename, lastname } = req.body;
      console.log("Creating user with:", { email, firstname, middlename, lastname });

      const { user, access_token } = await this.authService.signup({
        email,
        password,
        firstname,
        middlename,
        lastname,
      });

      console.log("User created successfully:", user._id);

      res.status(201).json({
        message: "User created successfully. Please verify your email.",
        user: {
          id: user._id,
          email: user.email,
          // name: user.name,
        },
        access_token,
      });
    } catch (error: any) {
      console.error("Signup error:", error);
      res.status(400).json({
        message: error.message,
        error: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      // console.log("Call api login: ", req.body);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, password } = req.body;
      const { user, accessToken } = await this.authService.login(email, password);
      // set up response, to return for client
      res.json({
        // message: 'Login successful',
        user: {
          _id: user._id,
          email: user.email,
          firstname: user.firstname,
          middlename: user.middlename,
          lastname: user.lastname,
          birthdate: user.birthdate,
          roles: user.roles,
        },
        access_token: accessToken,
      });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  };
}