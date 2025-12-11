import { useState } from "react";
import { Button } from "./components/ui/button";

export default function AddItemForm({ onAdd }: { onAdd: () => void }) {
  const [name, setName] = useState("asdasd");
  const [description, setDescription] = useState("asdasdasdasdasasd");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setMessage("Loading...");
    fetch("http://localhost:3000/item", {
      method: "POST",
      body: JSON.stringify({ name, description }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
        onAdd();
      })
      .catch((error) => setMessage(error.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="border p-4 rounded-md flex flex-col gap-4">
      <h2>Add Item</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          className="border p-2 rounded-md"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          className="border p-2 rounded-md"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button type="submit">{loading ? "Loading..." : "Add Item"}</Button>
      </form>
      {message && <div>{message}</div>}
    </div>
  );
}
