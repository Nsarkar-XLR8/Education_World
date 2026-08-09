import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';

export interface TuitionRecord {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  class: string;
  dayTime: string;
  slClgUn: string;
  subject: string;
  designation: 'student' | 'teacher';
  salary: string;
  version: string;
  img: string | null;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), '.data');
const FILE_PATH = path.join(DATA_DIR, 'tuitions.json');

const defaultTuitions: TuitionRecord[] = [
  {
    id: 1,
    name: 'Tanvir Hossain',
    email: 'tanvir.physics@gmail.com',
    phone: '+880 1711-234567',
    address: 'Dhanmondi, Dhaka',
    class: 'Class 9 - 12 (HSC)',
    dayTime: '3 Days/Week (5:00 PM - 7:00 PM)',
    slClgUn: 'BUET (Department of EEE)',
    subject: 'Physics & Higher Mathematics',
    designation: 'teacher',
    salary: '8,000 / month',
    version: 'English Version',
    img: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Nusrat Jahan',
    email: 'nusrat.buet@gmail.com',
    phone: '+880 1822-345678',
    address: 'Uttara Sector 4, Dhaka',
    class: 'Class 11 - 12 (Chemistry)',
    dayTime: '4 Days/Week (4:00 PM - 6:00 PM)',
    slClgUn: 'Dhaka University (Chemistry Dept)',
    subject: 'Chemistry & Biology',
    designation: 'teacher',
    salary: '7,500 / month',
    version: 'Bangla Medium',
    img: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Rafiqul Islam (Student Need)',
    email: 'rafiqul.guardian@gmail.com',
    phone: '+880 1933-456789',
    address: 'Mirpur 10, Dhaka',
    class: 'Class 10 (SSC Candidate)',
    dayTime: '3 Days/Week (Flexible Time)',
    slClgUn: 'Ideal School & College',
    subject: 'General Science & Mathematics',
    designation: 'student',
    salary: '6,000 / month',
    version: 'Bangla Medium',
    img: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'Dr. Ayesha Rahman',
    email: 'ayesha.ict@gmail.com',
    phone: '+880 1644-567890',
    address: 'Gulshan 2, Dhaka',
    class: 'Class 6 - 10 (ICT & English)',
    dayTime: '3 Days/Week (6:00 PM - 7:30 PM)',
    slClgUn: 'BRAC University (CSE)',
    subject: 'ICT & English Grammar',
    designation: 'teacher',
    salary: '9,000 / month',
    version: 'English Medium',
    img: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    name: 'Samiul Karim (Tutor Request)',
    email: 'samiul.parent@gmail.com',
    phone: '+880 1555-678901',
    address: 'Agrabad, Chittagong',
    class: 'HSC 2026 Candidate',
    dayTime: '4 Days/Week (Night Batch)',
    slClgUn: 'Chittagong College',
    subject: 'Higher Math & Physics',
    designation: 'student',
    salary: '8,500 / month',
    version: 'Bangla Medium',
    img: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 6,
    name: 'Farhana Chowdhury',
    email: 'farhana.du@gmail.com',
    phone: '+880 1766-789012',
    address: 'Zindabazar, Sylhet',
    class: 'Class 1 - 5 (All Subjects)',
    dayTime: '5 Days/Week (3:30 PM - 5:00 PM)',
    slClgUn: 'SUST (Dept of English)',
    subject: 'All Primary Subjects & Spoken English',
    designation: 'teacher',
    salary: '5,000 / month',
    version: 'English Version',
    img: null,
    createdAt: new Date().toISOString(),
  },
];

function getFallbackTuitions(): TuitionRecord[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(FILE_PATH)) {
      fs.writeFileSync(FILE_PATH, JSON.stringify(defaultTuitions, null, 2), 'utf-8');
      return defaultTuitions;
    }
    const content = fs.readFileSync(FILE_PATH, 'utf-8');
    return JSON.parse(content);
  } catch {
    return defaultTuitions;
  }
}

function saveFallbackTuitions(records: TuitionRecord[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(records, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save fallback tuitions:', e);
  }
}

export async function getTuitions(options?: {
  designation?: string;
  subject?: string;
  search?: string;
}): Promise<TuitionRecord[]> {
  const { designation, search } = options || {};

  // 1. Try Prisma DB first
  try {
    const where: Record<string, unknown> = {};
    if (designation) where.designation = designation;

    const dbTuitions = await prisma.student.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    if (dbTuitions && dbTuitions.length > 0) {
      return dbTuitions.map((t: typeof dbTuitions[number]) => ({
        id: t.id,
        name: t.name,
        email: t.email,
        phone: t.phone,
        address: t.address,
        class: t.class,
        dayTime: t.dayTime,
        slClgUn: t.slClgUn,
        subject: t.subject,
        designation: (t.designation as 'student' | 'teacher') || 'teacher',
        salary: t.salary || 'Negotiable',
        version: t.version || 'General',
        img: t.img,
        createdAt: t.createdAt.toISOString(),
      }));
    }
  } catch {
    // DB query failed or offline -> fall back to file store
  }

  // 2. Fallback File Store
  let list = getFallbackTuitions();

  if (designation) {
    list = list.filter((t) => t.designation.toLowerCase() === designation.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.address.toLowerCase().includes(q) ||
        t.class.toLowerCase().includes(q)
    );
  }

  return list;
}

export async function createTuition(data: Omit<TuitionRecord, 'id' | 'createdAt'>): Promise<TuitionRecord> {
  // 1. Try Prisma DB first
  try {
    const t = await prisma.student.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        class: data.class,
        dayTime: data.dayTime,
        slClgUn: data.slClgUn,
        subject: data.subject,
        designation: data.designation,
        salary: data.salary,
        version: data.version,
        img: data.img,
      },
    });

    return {
      id: t.id,
      name: t.name,
      email: t.email,
      phone: t.phone,
      address: t.address,
      class: t.class,
      dayTime: t.dayTime,
      slClgUn: t.slClgUn,
      subject: t.subject,
      designation: (t.designation as 'student' | 'teacher') || 'teacher',
      salary: t.salary || 'Negotiable',
      version: t.version || 'General',
      img: t.img,
      createdAt: t.createdAt.toISOString(),
    };
  } catch {
    // Fallback
  }

  // 2. Fallback File Store
  const list = getFallbackTuitions();
  const newId = list.length > 0 ? Math.max(...list.map((t) => t.id)) + 1 : 1;

  const newTuition: TuitionRecord = {
    ...data,
    id: newId,
    createdAt: new Date().toISOString(),
  };

  list.unshift(newTuition);
  saveFallbackTuitions(list);
  return newTuition;
}
