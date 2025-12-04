import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();
app.use(cors());

const items = [
  { id: 1, name: "Item 1", description: "Item 1 description" },
  { id: 2, name: "Item 2", description: "Item 2 description" },
  { id: 3, name: "Item 3", description: "Item 3 description" },
];

// list all items
app.get("/item", async (c) => {
  return c.json({
    success: true,
    data: items,
    message: "Items fetched successfully",
  });
});

// get a single item
app.get("/item/:id", async (c) => {
  const id = c.req.param("id");
  const item = items.find((item) => item.id === parseInt(id));
  const success = !!item;
  const status = success ? 200 : 404;
  const message = success ? "Item fetched successfully" : "Item not found";
  const data = success ? item : null;

  return c.json({ success, data, message }, status);
});

// create a new item
app.post("/item", async (c) => {
  const { name, description } = await c.req.json();
  const item = { id: items.length + 1, name, description };
  items.push(item);

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
app.delete("/item/:id", (c) => {
  return c.text("Hello Hono!");
});

export default app;
