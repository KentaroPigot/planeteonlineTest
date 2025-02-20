import bcrypt from "bcryptjs";
import User from "./User.model";

export function addUserHooks(UserModel: typeof User) {
  UserModel.addHook("beforeSave", async (user: any) => {
    if (!user.changed("password")) return;

    user.password = await bcrypt.hash(user.password, 12);

    user.passwordChangedAt = new Date(Date.now() - 1000);
    user.passwordConfirm = undefined;
  });

  UserModel.addHook("afterCreate", (user: any) => {
    user.password = undefined;
  });
}
