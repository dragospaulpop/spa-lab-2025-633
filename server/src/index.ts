import { Hono } from "hono";
import { cors } from "hono/cors";

import "dotenv/config";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { itemsTable } from "./db/schema";

const db = drizzle(process.env.DATABASE_URL!);

const app = new Hono();
app.use(cors());

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
  const items = await db.select().from(itemsTable);
  const item = items.find((item) => item.id === id);
  const success = !!item;
  const status = success ? 200 : 404;
  const message = success ? "Item fetched successfully" : "Item not found";
  const data = success ? item : null;

  return c.json({ success, data, message }, status);
});

// create a new item
app.post("/item", async (c) => {
  const { name, description } = await c.req.json();
  const item = { name, description, price: "100" };

  await db.insert(itemsTable).values(item);

  return c.json(
    {
      success: true,
      message: "Item created successfully",
    },
    201
  );
});

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

  await Bun.sleep(5000);

  await db.delete(itemsTable).where(eq(itemsTable.id, id));

  return c.json({
    success: true,
    message: "Item deleted successfully",
  });
});

export default app;
