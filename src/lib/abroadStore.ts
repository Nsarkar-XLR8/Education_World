import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';

export interface AbroadRecord {
  id: number;
  rankUni: string;
  university: string;
  courseOffer: string;
  tuitionFee: string;
  livingCost: string;
  fund: string;
  internship?: string;
  taRaGa?: string;
  contact?: string;
  engPro: string;
  score: string;
  countryName: string;
  cgpa: string;
  uniImg?: string | null;
  description?: string;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), '.data');
const FILE_PATH = path.join(DATA_DIR, 'abroad.json');

const defaultAbroad: AbroadRecord[] = [
  {
    id: 1,
    rankUni: '1',
    university: 'Massachusetts Institute of Technology (MIT)',
    courseOffer: 'M.Sc & Ph.D in Computer Science & AI',
    tuitionFee: '$57,590 / year',
    livingCost: '$1,200 / month',
    fund: 'Full Scholarship & TA/RA Available',
    internship: 'Co-op Internship at Top Tech Companies (Google, Apple, Microsoft)',
    taRaGa: '100% Tuition Waiver + $3,000/month stipend for TA/RA',
    contact: 'admissions@mit.edu | www.mit.edu',
    engPro: 'IELTS / TOEFL',
    score: '7.5 (TOEFL 100+)',
    countryName: 'USA',
    cgpa: '3.80 / 4.00',
    uniImg: null,
    description: 'World #1 ranked university renowned for cutting-edge Artificial Intelligence, Quantum Computing, and Engineering research.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    rankUni: '2',
    university: 'University of Cambridge',
    courseOffer: 'M.Phil in Advanced Computer Science',
    tuitionFee: '£37,293 / year',
    livingCost: '£1,100 / month',
    fund: 'Gates Cambridge Scholarship (Full Free)',
    internship: 'Silicon Fen Innovation Lab Internships',
    taRaGa: 'Research Fellowships & College Assistantships',
    contact: 'postgraduate.admissions@cam.ac.uk',
    engPro: 'IELTS',
    score: '7.5 (Min 7.0 each band)',
    countryName: 'UK',
    cgpa: '3.70 / 4.00',
    uniImg: null,
    description: 'One of the oldest and most prestigious universities in the world, leading scientific breakthroughs for over 800 years.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    rankUni: '18',
    university: 'University of Toronto',
    courseOffer: 'M.Sc in Applied Computing & Data Science',
    tuitionFee: 'CAD $32,000 / year',
    livingCost: 'CAD $1,400 / month',
    fund: '50% Tuition Waiver & Teaching Assistantship',
    internship: '8-Month Paid Industrial Internship Program',
    taRaGa: 'CAD $22/hour TA position guaranteed',
    contact: 'grad.admissions@utoronto.ca',
    engPro: 'IELTS',
    score: '7.0 (Min 6.5)',
    countryName: 'Canada',
    cgpa: '3.50 / 4.00',
    uniImg: null,
    description: 'Canada’s top research university located in vibrant Toronto, renowned for Machine Learning and Biomedical Engineering.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    rankUni: '14',
    university: 'University of Melbourne',
    courseOffer: 'Master of Information Technology & AI',
    tuitionFee: 'AUD $46,500 / year',
    livingCost: 'AUD $1,300 / month',
    fund: 'Melbourne International Graduate Scholarship',
    internship: 'Industry Partner Placement with Telstra & IBM',
    taRaGa: 'Graduate Research Assistantships Available',
    contact: 'study@unimelb.edu.au',
    engPro: 'IELTS',
    score: '6.5 (Min 6.0)',
    countryName: 'Australia',
    cgpa: '3.30 / 4.00',
    uniImg: null,
    description: 'Australia’s #1 university offering world-class technology research labs, vibrant campus life, and post-study work visas.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    rankUni: '37',
    university: 'Technical University of Munich (TUM)',
    courseOffer: 'M.Sc in Informatics & Robotics',
    tuitionFee: '€0 (No Tuition Fee - Semester Fee €150)',
    livingCost: '€950 / month',
    fund: 'DAAD Full Scholarship & Deutschlandstipendium',
    internship: 'Paid BMW, Siemens, and Audi Research Projects',
    taRaGa: 'HiWi Student Worker Positions (€14/hr)',
    contact: 'studium@tum.de | www.tum.de',
    engPro: 'IELTS / TOEFL',
    score: '6.5 (TOEFL 88)',
    countryName: 'Germany',
    cgpa: '3.20 / 4.00',
    uniImg: null,
    description: 'Germany’s premier technical university known for tuition-free high quality engineering, robotics, and computer science education.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 6,
    rankUni: '28',
    university: 'University of Tokyo',
    courseOffer: 'M.Sc in Global Information & Telecommunication',
    tuitionFee: '¥535,800 / year',
    livingCost: '¥120,000 / month',
    fund: 'MEXT Government Scholarship (Full Free + Monthly Allowance)',
    internship: 'Sony, Panasonic, & Toyota R&D Fellowships',
    taRaGa: 'UTokyo Special Fellowship & Research Grants',
    contact: 'admissions@u-tokyo.ac.jp',
    engPro: 'IELTS / TOEFL',
    score: '6.5 (TOEFL 80)',
    countryName: 'Japan',
    cgpa: '3.40 / 4.00',
    uniImg: null,
    description: 'Asia’s flagship academic institution producing Nobel Laureates and pioneering robotics technology.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 7,
    rankUni: '65',
    university: 'Universiti Malaya (UM)',
    courseOffer: 'Master of Computer Science & Software Engineering',
    tuitionFee: 'MYR 18,000 / year',
    livingCost: 'MYR 1,500 / month',
    fund: 'MIS Malaysian International Scholarship',
    internship: 'Cyberjaya Tech Hub Fellowships',
    taRaGa: 'Graduate Assistantship Scheme',
    contact: 'international@um.edu.my',
    engPro: 'IELTS',
    score: '6.0',
    countryName: 'Malaysia',
    cgpa: '3.00 / 4.00',
    uniImg: null,
    description: 'Top ranked Southeast Asian university offering affordable high quality English-medium degree programs.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 8,
    rankUni: '73',
    university: 'KTH Royal Institute of Technology',
    courseOffer: 'M.Sc in Machine Learning & Cyber Security',
    tuitionFee: 'SEK 155,000 / year',
    livingCost: 'SEK 9,500 / month',
    fund: 'Swedish Institute (SI) Scholarship (Full Tuition + Stipend)',
    internship: 'Ericsson & Spotify Co-op Opportunities',
    taRaGa: 'Research Assistant Grants',
    contact: 'info@kth.se | www.kth.se',
    engPro: 'IELTS',
    score: '6.5 (Min 5.5)',
    countryName: 'Sweden',
    cgpa: '3.25 / 4.00',
    uniImg: null,
    description: 'Sweden’s largest and oldest technical university, driving innovation in AI, sustainable energy, and telecommunications.',
    createdAt: new Date().toISOString(),
  },
];

function getFallbackAbroad(): AbroadRecord[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(FILE_PATH)) {
      fs.writeFileSync(FILE_PATH, JSON.stringify(defaultAbroad, null, 2), 'utf-8');
      return defaultAbroad;
    }
    const content = fs.readFileSync(FILE_PATH, 'utf-8');
    return JSON.parse(content);
  } catch {
    return defaultAbroad;
  }
}

function saveFallbackAbroad(records: AbroadRecord[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(records, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save fallback abroad data:', e);
  }
}

export async function getAbroadList(options?: {
  country?: string;
  search?: string;
  sort?: string;
}): Promise<AbroadRecord[]> {
  const { country, search, sort } = options || {};

  // 1. Try Prisma DB first
  try {
    const where: Record<string, unknown> = {};
    if (country) where.countryName = { equals: country, mode: 'insensitive' };

    const dbAbroad = await prisma.abroad.findMany({
      where,
      orderBy: { rankUni: 'asc' },
    });

    if (dbAbroad && dbAbroad.length > 0) {
      return dbAbroad.map((a) => ({
        id: a.id,
        rankUni: a.rankUni,
        university: a.university,
        courseOffer: a.courseOffer,
        tuitionFee: a.tuitionFee,
        livingCost: a.livingCost,
        fund: a.fund,
        internship: 'Industrial Internships Available',
        taRaGa: 'TA/RA Grants Available',
        contact: 'admissions@university.edu',
        engPro: a.engPro,
        score: a.score,
        countryName: a.countryName,
        cgpa: a.cgpa,
        uniImg: a.uniImg,
        description: 'Top global university offering world-class research and academic excellence.',
        createdAt: a.createdAt.toISOString(),
      }));
    }
  } catch {
    // Fall back to file store
  }

  // 2. Fallback File Store
  let list = getFallbackAbroad();

  if (country) {
    list = list.filter((a) => a.countryName.toLowerCase() === country.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (a) =>
        a.university.toLowerCase().includes(q) ||
        a.courseOffer.toLowerCase().includes(q) ||
        a.countryName.toLowerCase().includes(q)
    );
  }

  if (sort === 'rank') {
    list.sort((a, b) => parseInt(a.rankUni, 10) - parseInt(b.rankUni, 10));
  }

  return list;
}

export async function getAbroadById(id: number): Promise<AbroadRecord | null> {
  const list = getFallbackAbroad();
  return list.find((a) => a.id === id) || null;
}

export async function createAbroad(data: Omit<AbroadRecord, 'id' | 'createdAt'>): Promise<AbroadRecord> {
  try {
    const a = await prisma.abroad.create({
      data: {
        rankUni: data.rankUni,
        university: data.university,
        courseOffer: data.courseOffer,
        tuitionFee: data.tuitionFee,
        livingCost: data.livingCost,
        fund: data.fund,
        internship: data.internship || 'Industrial Internships Available',
        taRaGa: data.taRaGa || 'TA/RA Assistantship Available',
        contact: data.contact || 'admissions@university.edu',
        engPro: data.engPro,
        score: data.score,
        countryName: data.countryName,
        cgpa: data.cgpa,
        uniImg: data.uniImg,
      },
    });

    return {
      id: a.id,
      rankUni: a.rankUni,
      university: a.university,
      courseOffer: a.courseOffer,
      tuitionFee: a.tuitionFee,
      livingCost: a.livingCost,
      fund: a.fund,
      internship: data.internship || 'Industrial Internships Available',
      taRaGa: data.taRaGa || 'TA/RA Assistantship Available',
      contact: data.contact || 'admissions@university.edu',
      engPro: a.engPro,
      score: a.score,
      countryName: a.countryName,
      cgpa: a.cgpa,
      uniImg: a.uniImg,
      description: data.description || 'Top global university offering world-class research.',
      createdAt: a.createdAt.toISOString(),
    };
  } catch {
    // Fallback
  }

  const list = getFallbackAbroad();
  const newId = list.length > 0 ? Math.max(...list.map((a) => a.id)) + 1 : 1;
  const newRecord: AbroadRecord = {
    ...data,
    id: newId,
    createdAt: new Date().toISOString(),
  };

  list.unshift(newRecord);
  saveFallbackAbroad(list);
  return newRecord;
}

export async function deleteAbroad(id: number): Promise<boolean> {
  try {
    await prisma.abroad.delete({ where: { id } });
  } catch {
    // Fallback delete
  }

  const list = getFallbackAbroad();
  const filtered = list.filter((a) => a.id !== id);
  saveFallbackAbroad(filtered);
  return true;
}
