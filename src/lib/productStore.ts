import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';

export interface ProductRecord {
  id: number;
  productName: string;
  writerName: string;
  productPrice: number;
  discount: number;
  levelScClgUni: 'school' | 'college' | 'university' | 'kids' | 'others';
  stockProduct: number;
  img: string | null;
  description?: string;
  publisher?: string;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), '.data');
const FILE_PATH = path.join(DATA_DIR, 'products.json');

const defaultProducts: ProductRecord[] = [
  {
    id: 1,
    productName: 'Higher Mathematics Class 9-10',
    writerName: 'NCTB Board',
    productPrice: 350,
    discount: 10,
    levelScClgUni: 'school',
    stockProduct: 25,
    img: null,
    description: 'Official NCTB Higher Mathematics textbook covering Algebra, Geometry, Trigonometry, and Calculus basics for secondary students.',
    publisher: 'National Curriculum and Textbook Board',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    productName: 'Physics for Class 9-10',
    writerName: 'Dr. Shahjahan Tapan',
    productPrice: 420,
    discount: 15,
    levelScClgUni: 'school',
    stockProduct: 18,
    img: null,
    description: 'Comprehensive physics guidebook with practice questions, conceptual diagrams, and board exam solutions.',
    publisher: 'Lector Publication',
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    productName: 'HSC Chemistry 1st Paper',
    writerName: 'Dr. Soroj Kanti Singha Hazari',
    productPrice: 650,
    discount: 12,
    levelScClgUni: 'college',
    stockProduct: 30,
    img: null,
    description: 'Standard HSC Chemistry textbook covering Atomic Structure, Periodic Table, Chemical Bonding, and Quantitative Chemistry.',
    publisher: 'Hassan Book House',
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    productName: 'HSC Physics 2nd Paper',
    writerName: 'Dr. Shahjahan Tapan',
    productPrice: 680,
    discount: 10,
    levelScClgUni: 'college',
    stockProduct: 20,
    img: null,
    description: 'Covers Thermodynamics, Electrostatics, Current Electricity, Optics, and Modern Physics for HSC candidates.',
    publisher: 'Hassan Book House',
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    productName: 'University Physics with Modern Physics',
    writerName: 'Hugh D. Young & Roger A. Freedman',
    productPrice: 1850,
    discount: 20,
    levelScClgUni: 'university',
    stockProduct: 12,
    img: null,
    description: 'World-renowned physics textbook for undergraduate science and engineering university students.',
    publisher: 'Pearson Education',
    createdAt: new Date().toISOString(),
  },
  {
    id: 6,
    productName: 'Calculus: Early Transcendentals',
    writerName: 'James Stewart',
    productPrice: 1600,
    discount: 15,
    levelScClgUni: 'university',
    stockProduct: 15,
    img: null,
    description: 'Definitive guide to Single and Multivariable Calculus, Vector Calculus, and Differential Equations.',
    publisher: 'Cengage Learning',
    createdAt: new Date().toISOString(),
  },
  {
    id: 7,
    productName: 'The Magic Treehouse Story Collection',
    writerName: 'Mary Pope Osborne',
    productPrice: 280,
    discount: 5,
    levelScClgUni: 'kids',
    stockProduct: 40,
    img: null,
    description: 'Fun adventure storybook for children, featuring time travel, animals, and magical quests.',
    publisher: 'Random House Books for Young Readers',
    createdAt: new Date().toISOString(),
  },
  {
    id: 8,
    productName: 'Illustrated Animal Encyclopedia for Kids',
    writerName: 'DK Publishing',
    productPrice: 490,
    discount: 10,
    levelScClgUni: 'kids',
    stockProduct: 22,
    img: null,
    description: 'Vibrant, colorful encyclopedia filled with fascinating animal facts, high-quality illustrations, and quizzes.',
    publisher: 'DK Children',
    createdAt: new Date().toISOString(),
  },
  {
    id: 9,
    productName: 'General Knowledge 2026',
    writerName: 'Professor Abdul Quddus',
    productPrice: 380,
    discount: 10,
    levelScClgUni: 'others',
    stockProduct: 50,
    img: null,
    description: 'Updated general knowledge and current affairs book for BCS, Job preparation, and University Admission test takers.',
    publisher: 'Professors Publication',
    createdAt: new Date().toISOString(),
  },
  {
    id: 10,
    productName: 'BCS English Grammar & Vocabulary',
    writerName: 'M. M. Rahman',
    productPrice: 450,
    discount: 15,
    levelScClgUni: 'others',
    stockProduct: 35,
    img: null,
    description: 'Comprehensive competitive examination guide for English syntax, idioms, vocabulary, and comprehension.',
    publisher: 'Oracle Publications',
    createdAt: new Date().toISOString(),
  },
];

function getFallbackProducts(): ProductRecord[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(FILE_PATH)) {
      fs.writeFileSync(FILE_PATH, JSON.stringify(defaultProducts, null, 2), 'utf-8');
      return defaultProducts;
    }
    const content = fs.readFileSync(FILE_PATH, 'utf-8');
    return JSON.parse(content);
  } catch {
    return defaultProducts;
  }
}

function saveFallbackProducts(products: ProductRecord[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(products, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save fallback products:', e);
  }
}

export async function getProducts(options?: {
  level?: string;
  search?: string;
  sort?: string;
}): Promise<ProductRecord[]> {
  const { level, search, sort } = options || {};

  // 1. Try Prisma DB first
  try {
    const where: Record<string, unknown> = {};
    if (level) where.levelScClgUni = level;
    if (search) {
      where.OR = [
        { productName: { contains: search, mode: 'insensitive' } },
        { writerName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const dbProducts = await prisma.product.findMany({
      where,
      orderBy: sort === 'price_asc'
        ? { productPrice: 'asc' }
        : sort === 'price_desc'
        ? { productPrice: 'desc' }
        : sort === 'discount'
        ? { discount: 'desc' }
        : { createdAt: 'desc' },
    });

    if (dbProducts && dbProducts.length > 0) {
      return dbProducts.map((p) => ({
        id: p.id,
        productName: p.productName,
        writerName: p.writerName,
        productPrice: Number(p.productPrice),
        discount: Number(p.discount),
        levelScClgUni: p.levelScClgUni as ProductRecord['levelScClgUni'],
        stockProduct: p.stockProduct,
        img: p.img,
        description: 'Quality educational book for your studies.',
        publisher: 'Education World Press',
        createdAt: p.createdAt.toISOString(),
      }));
    }
  } catch {
    // DB query failed or offline -> fall back to file store
  }

  // 2. Fallback File Store
  let list = getFallbackProducts();

  if (level) {
    list = list.filter((p) => p.levelScClgUni.toLowerCase() === level.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (p) =>
        p.productName.toLowerCase().includes(q) ||
        p.writerName.toLowerCase().includes(q)
    );
  }

  if (sort === 'price_asc') {
    list.sort((a, b) => a.productPrice - b.productPrice);
  } else if (sort === 'price_desc') {
    list.sort((a, b) => b.productPrice - a.productPrice);
  } else if (sort === 'discount') {
    list.sort((a, b) => b.discount - a.discount);
  }

  return list;
}

export async function getProductById(id: number): Promise<ProductRecord | null> {
  // 1. Try Prisma DB first
  try {
    const p = await prisma.product.findUnique({ where: { id } });
    if (p) {
      return {
        id: p.id,
        productName: p.productName,
        writerName: p.writerName,
        productPrice: Number(p.productPrice),
        discount: Number(p.discount),
        levelScClgUni: p.levelScClgUni as ProductRecord['levelScClgUni'],
        stockProduct: p.stockProduct,
        img: p.img,
        description: 'Quality educational book for your academic success.',
        publisher: 'Education World Press',
        createdAt: p.createdAt.toISOString(),
      };
    }
  } catch {
    // Fall back to file store
  }

  // 2. Fallback File Store
  const list = getFallbackProducts();
  return list.find((p) => p.id === id) || null;
}

export async function createProduct(data: Omit<ProductRecord, 'id' | 'createdAt'>): Promise<ProductRecord> {
  try {
    const p = await prisma.product.create({
      data: {
        productName: data.productName,
        writerName: data.writerName,
        productPrice: data.productPrice,
        discount: data.discount,
        levelScClgUni: data.levelScClgUni,
        stockProduct: data.stockProduct,
        img: data.img,
      },
    });
    return {
      id: p.id,
      productName: p.productName,
      writerName: p.writerName,
      productPrice: Number(p.productPrice),
      discount: Number(p.discount),
      levelScClgUni: p.levelScClgUni as ProductRecord['levelScClgUni'],
      stockProduct: p.stockProduct,
      img: p.img,
      description: data.description,
      publisher: data.publisher,
      createdAt: p.createdAt.toISOString(),
    };
  } catch {
    // Fallback
  }

  const list = getFallbackProducts();
  const newId = list.length > 0 ? Math.max(...list.map((p) => p.id)) + 1 : 1;
  const newProduct: ProductRecord = {
    ...data,
    id: newId,
    createdAt: new Date().toISOString(),
  };

  list.unshift(newProduct);
  saveFallbackProducts(list);
  return newProduct;
}
