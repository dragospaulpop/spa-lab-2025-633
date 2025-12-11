import { useEffect, useState } from "react";
import AddItemForm from "./add-item-form";

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shouldFetchItems, setShouldFetchItems] = useState(0);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleClick = () => {
    setLoading(true);
    fetch("http://localhost:3000/item")
      .then((response) => response.json())
      .then((data) => setItems(data.data))
      .catch((error) => console.error("Error:", error))
      .finally(() => setLoading(false));
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    fetch(`http://localhost:3000/item/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete item");
        }
        return response.json();
      })
      .then(() => {
        setShouldFetchItems((prev) => prev + 1);
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
        alert("Failed to delete item");
      })
      .finally(() => {
        setDeletingId(null);
      });
  };

  useEffect(() => {
    handleClick();
  }, [shouldFetchItems]);

  return (
    <div className="flex flex-col gap-4 h-screen p-4">
      <h1 className="text-5xl font-bold">Items</h1>
      <div className="grid grid-cols-3 gap-4 max-h-[500px] overflow-y-auto">
        {items.map((item: any) => (
          <div key={item.id} className="border p-4 rounded-md flex flex-col justify-between gap-2">
            <div>
              <h2 className="font-bold text-xl">{item.name}</h2>
              <p className="text-gray-600">{item.description}</p>
            </div>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:bg-red-300 transition-colors self-end"
              onClick={() => handleDelete(item.id)}
              disabled={deletingId === item.id}
            >
              {deletingId === item.id ? "Deleting..." : "Delete"}
            </button>
          </div>
        ))}
      </div>
      <button
        className="border px-4 py-2 rounded-md hover:bg-stone-400 bg-stone-600 cursor-pointer"
        onClick={handleClick}
      >
        {loading ? "Loading..." : "Fetch items"}
      </button>
      <AddItemForm onAdd={() => setShouldFetchItems(shouldFetchItems + 1)} />
    </div>
  );
}

export default App;
