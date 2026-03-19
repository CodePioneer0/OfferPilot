import { getNextId, usersCollection, type UserEntity } from "../db/client.js";

export interface UserRecord {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

function mapUser(user: UserEntity): UserRecord {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    passwordHash: user.passwordHash,
    createdAt: user.createdAt
  };
}

export async function createUser(name: string, email: string, passwordHash: string): Promise<UserRecord> {
  const now = new Date().toISOString();

  const user: UserEntity = {
    id: await getNextId("users"),
    name,
    email,
    passwordHash,
    createdAt: now
  };

  await usersCollection().insertOne(user);
  return mapUser(user);
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const user = await usersCollection().findOne({ email });

  return user ? mapUser(user) : null;
}

export async function findUserById(id: number): Promise<UserRecord | null> {
  const user = await usersCollection().findOne({ id });

  return user ? mapUser(user) : null;
}
