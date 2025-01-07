import { pgTable, serial, text, boolean, timestamp, integer, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
});

export const clubs = pgTable("clubs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  municipality: text("municipality").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  orgNumber: text("org_number").notNull(),
  description: text("description"),
  validated: boolean("validated").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").notNull().references(() => clubs.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  authorName: text("author_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export const insertClubSchema = createInsertSchema(clubs, {
  name: z.string().min(1, "Name is required"),
  municipality: z.string().min(1, "Municipality is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email address"),
  orgNumber: z.string().min(1, "Organization number is required"),
  description: z.string().optional(),
});

export const selectClubSchema = createSelectSchema(clubs);
export type InsertClub = typeof clubs.$inferInsert;
export type Club = typeof clubs.$inferSelect;

export const insertReviewSchema = createInsertSchema(reviews, {
  clubId: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
  authorName: z.string().min(1, "Author name is required"),
});

export const selectReviewSchema = createSelectSchema(reviews);
export type InsertReview = typeof reviews.$inferInsert;
export type Review = typeof reviews.$inferSelect;