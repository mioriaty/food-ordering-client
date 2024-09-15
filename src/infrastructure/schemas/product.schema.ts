import z from 'zod';

export const CreateProductRequestSchema = z.object({
  name: z.string().min(1).max(256),
  price: z.coerce.number().positive(),
  description: z.string().max(10000),
  image: z.string().url()
});

export type CreateProductRequestType = z.TypeOf<typeof CreateProductRequestSchema>;

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  description: z.string(),
  image: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const ProductResponseSchema = z.object({
  data: ProductSchema,
  message: z.string()
});

export type ProductResponseType = z.TypeOf<typeof ProductResponseSchema>;

export const ProductListResponseSchema = z.object({
  data: z.array(ProductSchema),
  message: z.string()
});

export type ProductListResponseType = z.TypeOf<typeof ProductListResponseSchema>;

export const UpdateProductRequestSchema = CreateProductRequestSchema;

export type UpdateProductBodyType = CreateProductRequestType;

export const ProductParamsSchema = z.object({
  id: z.coerce.number()
});
export type ProductParamsType = z.TypeOf<typeof ProductParamsSchema>;
