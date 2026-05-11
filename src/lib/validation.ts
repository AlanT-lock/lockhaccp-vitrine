import { z } from "zod";

// French phone regex (supports 06, 07, 01-05, 09 formats)
const frenchPhoneRegex = /^(?:(?:\+33|0033|0)[1-9])(?:[0-9]{8})$/;

// Contact Demo form schema
export const contactDemoSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(1, "Le nom de l'entreprise est requis")
    .max(100, "Le nom de l'entreprise ne peut pas dépasser 100 caractères"),
  contactName: z
    .string()
    .trim()
    .min(1, "Votre nom est requis")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  email: z
    .string()
    .trim()
    .email("Adresse email invalide")
    .max(255, "L'email ne peut pas dépasser 255 caractères"),
  phone: z
    .string()
    .trim()
    .min(1, "Le téléphone est requis")
    .refine(
      (val) => frenchPhoneRegex.test(val.replace(/[\s.-]/g, "")),
      "Numéro de téléphone invalide"
    ),
  companySize: z.string().optional(),
  message: z
    .string()
    .trim()
    .max(2000, "Le message ne peut pas dépasser 2000 caractères")
    .optional(),
});

// Contact Info form schema
export const contactInfoSchema = z.object({
  contactName: z
    .string()
    .trim()
    .min(1, "Votre nom est requis")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  email: z
    .string()
    .trim()
    .email("Adresse email invalide")
    .max(255, "L'email ne peut pas dépasser 255 caractères"),
  message: z
    .string()
    .trim()
    .min(1, "Votre message est requis")
    .max(2000, "Le message ne peut pas dépasser 2000 caractères"),
});

// Checkout email schema
export const checkoutEmailSchema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  planId: z.enum(["essentiel", "pro"]),
});

export type ContactDemoForm = z.infer<typeof contactDemoSchema>;
export type ContactInfoForm = z.infer<typeof contactInfoSchema>;

// Helper validation functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  return frenchPhoneRegex.test(phone.replace(/[\s.-]/g, ""));
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};
