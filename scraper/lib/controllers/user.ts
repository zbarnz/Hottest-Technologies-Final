import { User } from "../../src/entity/User";
import { getConnection } from "../../src/data-source";

export async function createUser(userData: Partial<User>) {
  const connection = await getConnection();
  const user = connection.manager.create(User, userData);
  return await connection.manager.save(user);
}

export async function getUser(userId: number) {
  const connection = await getConnection();
  return await connection.manager.findOne(User, {
    where: { id: userId },
  });
}
