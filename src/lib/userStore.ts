import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export interface UserRecord {
  id: number;
  name: string;
  phone: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN';
  amountBks: number;
  amountNgd: number;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), '.data');
const FILE_PATH = path.join(DATA_DIR, 'users.json');

// Ensure fallback JSON file exists with demo users
function getFallbackUsers(): UserRecord[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(FILE_PATH)) {
      const defaultHash = bcrypt.hashSync('admin123', 10);
      const userHash = bcrypt.hashSync('user123', 10);

      const defaults: UserRecord[] = [
        {
          id: 1,
          name: 'System Admin',
          phone: '+880 1700-000000',
          email: 'admin@educationworld.com',
          password: defaultHash,
          role: 'ADMIN',
          amountBks: 10000,
          amountNgd: 10000,
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          name: 'Demo Student',
          phone: '+880 1800-000000',
          email: 'user@educationworld.com',
          password: userHash,
          role: 'USER',
          amountBks: 5000,
          amountNgd: 5000,
          createdAt: new Date().toISOString(),
        },
      ];
      fs.writeFileSync(FILE_PATH, JSON.stringify(defaults, null, 2), 'utf-8');
      return defaults;
    }
    const content = fs.readFileSync(FILE_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    console.error('Failed to read fallback users store:', e);
    return [];
  }
}

function saveFallbackUsers(users: UserRecord[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(users, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write fallback users store:', e);
  }
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  // 1. Try Prisma DB first
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      return {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        password: user.password,
        role: user.role as 'USER' | 'ADMIN',
        amountBks: Number(user.amountBks),
        amountNgd: Number(user.amountNgd),
        createdAt: user.createdAt.toISOString(),
      };
    }
  } catch {
    // DB query failed or connection down -> use file fallback
  }

  // 2. Fallback to file store
  const users = getFallbackUsers();
  const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  return found || null;
}

export async function createUser(data: {
  name: string;
  phone: string;
  email: string;
  password: string;
  role?: 'USER' | 'ADMIN';
}): Promise<UserRecord> {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const amountBks = Math.floor(Math.random() * 18000) + 2000;
  const amountNgd = Math.floor(Math.random() * 17200) + 1800;
  const role = data.role || 'USER';

  // 1. Try Prisma DB first
  try {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        password: hashedPassword,
        role,
        amountBks,
        amountNgd,
        tuitionProfile: {
          create: {
            name: data.name,
            email: data.email,
            mobile: data.phone,
          },
        },
      },
    });

    return {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      password: user.password,
      role: user.role as 'USER' | 'ADMIN',
      amountBks: Number(user.amountBks),
      amountNgd: Number(user.amountNgd),
      createdAt: user.createdAt.toISOString(),
    };
  } catch {
    // DB operation failed -> save to file fallback
  }

  // 2. Fallback to file store
  const users = getFallbackUsers();
  const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;

  const newUser: UserRecord = {
    id: newId,
    name: data.name,
    phone: data.phone,
    email: data.email,
    password: hashedPassword,
    role,
    amountBks,
    amountNgd,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveFallbackUsers(users);

  return newUser;
}
