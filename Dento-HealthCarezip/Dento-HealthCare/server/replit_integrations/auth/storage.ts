import { UserModel } from "../../mongodb";

export type UpsertUser = {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
};

export interface IAuthStorage {
  getUser(id: string): Promise<any>;
  upsertUser(user: UpsertUser): Promise<any>;
}

class AuthStorage implements IAuthStorage {
  async getUser(id: string): Promise<any> {
    const user = await UserModel.findById(id);
    if (!user) return undefined;
    const obj: any = user.toObject();
    obj.id = obj._id?.toString();
    delete obj._id;
    delete obj.__v;
    return obj;
  }

  async upsertUser(userData: UpsertUser): Promise<any> {
    const fullName = `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || "User";
    
    const user = await UserModel.findByIdAndUpdate(
      userData.id,
      {
        $setOnInsert: {
          username: userData.email || userData.id,
          password: "",
          userType: "patient",
        },
        $set: {
          email: userData.email,
          fullName: fullName,
        }
      },
      { upsert: true, new: true }
    );
    
    const obj: any = user?.toObject();
    if (obj) {
      obj.id = obj._id?.toString();
      delete obj._id;
      delete obj.__v;
    }
    return obj;
  }
}

export const authStorage = new AuthStorage();
