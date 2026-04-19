import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../models/User";

const signupSchema = z.object({
  name:     z.string().min(2, "Name must be at least 2 characters"),
  email:    z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

function generateTokens(userId: string) {
  const access  = jwt.sign({ userId }, process.env.JWT_SECRET!,         { expiresIn: "15m" });
  const refresh = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
  return { access, refresh };
}

function setRefreshCookie(res: Response, token: string) {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge:   7 * 24 * 60 * 60 * 1000,
  });
}

export async function signup(req: Request, res: Response) {
  const result = signupSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ message: result.error.errors[0].message });

  const { name, email, password } = result.data;

  if (await User.findOne({ email }))
    return res.status(409).json({ message: "An account with this email already exists" });

  const user = await User.create({ name, email, password });
  const { access, refresh } = generateTokens(String(user._id));

  setRefreshCookie(res, refresh);
  res.status(201).json({ user, accessToken: access });
}

export async function login(req: Request, res: Response) {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ message: result.error.errors[0].message });

  const { email, password } = result.data;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ message: "Incorrect email or password" });

  const { access, refresh } = generateTokens(String(user._id));
  setRefreshCookie(res, refresh);
  res.json({ user, accessToken: access });
}

export async function refresh(req: Request, res: Response) {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const payload     = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { userId: string };
    const { access, refresh: newRefresh } = generateTokens(payload.userId);
    setRefreshCookie(res, newRefresh);
    res.json({ accessToken: access });
  } catch {
    res.status(401).json({ message: "Session expired, please log in again" });
  }
}

export async function logout(_: Request, res: Response) {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
}
