
import { db } from "@db";
import { users } from "@db/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function createAdmin(username: string, password: string) {
  const hashedPassword = await hashPassword(password);
  
  try {
    const [user] = await db
      .insert(users)
      .values({
        username,
        password: hashedPassword,
      })
      .returning();
    
    console.log("Admin user created successfully:", username);
    return user;
  } catch (error) {
    console.error("Failed to create admin user:", error);
    throw error;
  }
}

// Create admin user with provided credentials
const username = process.argv[2];
const password = process.argv[3];

if (!username || !password) {
  console.error("Usage: tsx server/createAdmin.ts <username> <password>");
  process.exit(1);
}

createAdmin(username, password)
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
