import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env.js";
import { prisma } from "../config/prisma.js";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const tokenFor = (user: { id: string; email: string; name: string }) =>
  jwt.sign({ id: user.id, email: user.email, name: user.name }, env.JWT_SECRET, { expiresIn: "8h" });

export const authService = {
  async register(input: z.infer<typeof registerSchema>) {
    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await prisma.user.create({
      data: { name: input.name, email: input.email.toLowerCase(), passwordHash },
      select: { id: true, email: true, name: true }
    });
    return { user, token: tokenFor(user) };
  },

  async login(input: z.infer<typeof loginSchema>) {
    const user = await prisma.user.findUnique({ where: { email: input.email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
      throw Object.assign(new Error("Invalid credentials"), { status: 401 });
    }
    const safeUser = { id: user.id, email: user.email, name: user.name };
    return { user: safeUser, token: tokenFor(safeUser) };
  }
};
