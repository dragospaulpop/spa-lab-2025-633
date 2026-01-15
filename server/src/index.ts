import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { cors } from "hono/cors";

import "dotenv/config";
import { eq } from "drizzle-orm";

import z from "zod";
import { itemsTable } from "./db/schema";

import { db } from "./db/index";
import { auth } from "./auth/auth";

const app = new Hono();
app.use(cors({
  origin: "http://localhost:5173",
  allowMethods: ["GET", "POST", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
}));

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

// list all items
app.get("/item", async (c) => {
  const items = await db.select().from(itemsTable);
  return c.json({
    success: true,
    data: items,
    message: "Items fetched successfully",
  });
});

// get a single item
app.get("/item/:id", async (c) => {
  const id = c.req.param("id");
  const [item] = await db.select().from(itemsTable).where(eq(itemsTable.id, id)).limit(1);

  const success = !!item;
  const status = success ? 200 : 404;
  const message = success ? "Item fetched successfully" : "Item not found";
  const data = success ? item : null;

  return c.json({ success, data, message }, status);
});

// create a new item
app.post(
  "/item",
  zValidator(
    "json",
    z.object({
      name: z
        .string()
        .min(3, "Name must be at least 5 characters.")
        .max(32, "Name must be at most 32 characters."),
      description: z
        .string()
        .min(10, "Description must be at least 20 characters.")
        .max(100, "Description must be at most 100 characters."),
      price: z
        .number()
        .min(0.01, "Price must be greater than 0.")
        .transform((val) => val.toString()),
    })
  ),
  async (c) => {
    const item = c.req.valid("json");

    try {
      await db.insert(itemsTable).values(item);
    } catch (error: unknown) {
      return c.json(
        {
          success: false,
          message: (error as Error)?.message || "Failed to create item",
        },
        500
      );
    }

    return c.json(
      {
        success: true,
        message: "Item created successfully",
      },
      201
    );
  }
);

// update an existing item by completely replacing it
app.put("/item/:id", (c) => {
  return c.text("Hello Hono!");
});

// partially update an existing item
app.patch("/item/:id", (c) => {
  return c.text("Hello Hono!");
});

// delete an existing item
app.delete("/item/:id", async (c) => {
  const id = c.req.param("id");

  await db.delete(itemsTable).where(eq(itemsTable.id, id));

  return c.json({
    success: true,
    message: "Item deleted successfully",
  });
});

export default app;
