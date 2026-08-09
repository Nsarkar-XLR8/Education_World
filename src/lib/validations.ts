import { z } from 'zod';

// ─── Auth Schemas ───────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// ─── Product Schemas ────────────────────────────────────

export const productSchema = z.object({
  productName: z.string().min(1, 'Product name is required'),
  writerName: z.string().min(1, 'Writer name is required'),
  productPrice: z.coerce.number().positive('Price must be positive'),
  discount: z.coerce.number().min(0).max(100).default(0),
  levelScClgUni: z.enum(['school', 'college', 'university', 'kids', 'others']),
  stockProduct: z.coerce.number().int().min(0).default(0),
});

// ─── Cart Schemas ───────────────────────────────────────

export const addToCartSchema = z.object({
  productId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().positive().default(1),
});

// ─── Order Schemas ──────────────────────────────────────

export const checkoutSchema = z.object({
  address: z.string().min(5, 'Address must be at least 5 characters'),
});

export const orderStatusSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'DELIVERED']),
});

// ─── Tuition Schemas ────────────────────────────────────

export const studentSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string().min(5),
  class: z.string().min(1),
  dayTime: z.string().min(1),
  slClgUn: z.string().min(1),
  subject: z.string().min(1),
  designation: z.enum(['student', 'teacher']),
  salary: z.string().optional(),
  version: z.string().optional(),
});

// ─── Message Schemas ────────────────────────────────────

export const messageSchema = z.object({
  msg: z.string().min(1, 'Message cannot be empty'),
  recPhone: z.string().min(10, 'Recipient phone is required'),
});

// ─── Comment Schemas ────────────────────────────────────

export const commentSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1, 'Message cannot be empty'),
});

// ─── Study Abroad Schemas ───────────────────────────────

export const abroadSchema = z.object({
  rankUni: z.string().min(1),
  university: z.string().min(1),
  courseOffer: z.string().min(1),
  tuitionFee: z.string().min(1),
  livingCost: z.string().min(1),
  fund: z.string(),
  internship: z.string(),
  taRaGa: z.string(),
  contact: z.string(),
  engPro: z.string(),
  score: z.string(),
  countryName: z.string().min(1),
  cgpa: z.string(),
});

// ─── Type Exports ───────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type StudentInput = z.infer<typeof studentSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
export type AbroadInput = z.infer<typeof abroadSchema>;
