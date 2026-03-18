import { getNextId, readStore, runInStoreTransaction, type UserEntity } from "../db/client.js";

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

export function createUser(name: string, email: string, passwordHash: string): UserRecord {
  return runInStoreTransaction((store) => {
    const now = new Date().toISOString();

    const user: UserEntity = {
      id: getNextId("users", store),
      name,
      email,
      passwordHash,
      createdAt: now
    };

    store.users.push(user);

    return mapUser(user);
  });
}

export function findUserByEmail(email: string): UserRecord | null {
  const store = readStore();
  const user = store.users.find((candidate) => candidate.email === email);

  return user ? mapUser(user) : null;
}

export function findUserById(id: number): UserRecord | null {
  const store = readStore();
  const user = store.users.find((candidate) => candidate.id === id);

  return user ? mapUser(user) : null;
}
