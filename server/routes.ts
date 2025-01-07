import type { Express } from "express";
import { createServer, type Server } from "http";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@db";
import { clubs } from "@db/schema";
import { setupAuth } from "./auth";

// Middleware to check if user is authenticated
function requireAuth(req: Express.Request, res: Express.Response, next: Function) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send("Unauthorized");
}

export function registerRoutes(app: Express): Server {
  // Setup authentication routes (/api/login, /api/logout, /api/user)
  setupAuth(app);

  // Get all validated clubs
  app.get("/api/clubs", async (_req, res) => {
    try {
      const validatedClubs = await db
        .select()
        .from(clubs)
        .where(eq(clubs.validated, true))
        .orderBy(desc(clubs.createdAt));
      res.json(validatedClubs);
    } catch (error) {
      res.status(500).send("Failed to fetch clubs");
    }
  });

  // Get list of unique municipalities from validated clubs
  app.get("/api/municipalities", async (_req, res) => {
    try {
      const results = await db
        .select({ municipality: clubs.municipality })
        .from(clubs)
        .where(eq(clubs.validated, true))
        .groupBy(clubs.municipality);
      
      const municipalities = results.map(r => r.municipality);
      res.json(municipalities);
    } catch (error) {
      res.status(500).send("Failed to fetch municipalities");
    }
  });

  // Submit new club (unvalidated)
  app.post("/api/clubs", async (req, res) => {
    try {
      const [newClub] = await db
        .insert(clubs)
        .values({
          ...req.body,
          validated: false,
        })
        .returning();
      res.json(newClub);
    } catch (error) {
      res.status(500).send("Failed to submit club");
    }
  });

  // Get pending (unvalidated) clubs - admin only
  app.get("/api/clubs/pending", requireAuth, async (_req, res) => {
    try {
      const pendingClubs = await db
        .select()
        .from(clubs)
        .where(eq(clubs.validated, false))
        .orderBy(desc(clubs.createdAt));
      res.json(pendingClubs);
    } catch (error) {
      res.status(500).send("Failed to fetch pending clubs");
    }
  });

  // Validate a club - admin only
  app.post("/api/clubs/:id/validate", requireAuth, async (req, res) => {
    const { id } = req.params;
    try {
      const [updatedClub] = await db
        .update(clubs)
        .set({ validated: true })
        .where(and(
          eq(clubs.id, parseInt(id)),
          eq(clubs.validated, false)
        ))
        .returning();
      
      if (!updatedClub) {
        return res.status(404).send("Club not found or already validated");
      }
      
      res.json(updatedClub);
    } catch (error) {
      res.status(500).send("Failed to validate club");
    }
  });

  // Delete a pending club - admin only
  app.delete("/api/clubs/:id", requireAuth, async (req, res) => {
    const { id } = req.params;
    try {
      const [deletedClub] = await db
        .delete(clubs)
        .where(and(
          eq(clubs.id, parseInt(id)),
          eq(clubs.validated, false)
        ))
        .returning();
      
      if (!deletedClub) {
        return res.status(404).send("Club not found or already validated");
      }
      
      res.json({ message: "Club deleted successfully" });
    } catch (error) {
      res.status(500).send("Failed to delete club");
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
