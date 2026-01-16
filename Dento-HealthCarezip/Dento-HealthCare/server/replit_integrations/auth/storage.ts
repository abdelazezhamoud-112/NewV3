import { users, type User } from "@shared/schema";
import { db } from "../../db";
import { eq } from "drizzle-orm";

export type UpsertUser = {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
};

export interface IAuthStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
}

class AuthStorage implements IAuthStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        id: userData.id,
        username: userData.email || userData.id,
        password: "",
        fullName: `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || "User",
        email: userData.email,
        userType: "patient",
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          fullName: `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || undefined,
        },
      })
      .returning();
    return user;
  }
}

export const authStorage = new AuthStorage();
