import { useEffect, useState } from "react";
import AddItemForm from "./add-item-form";

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shouldFetchItems, setShouldFetchItems] = useState(0);

  const handleClick = () => {
    setLoading(true);
    fetch("http://localhost:3000/item")
      .then((response) => response.json())
      .then((data) => setItems(data.data))
      .catch((error) => console.error("Error:", error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleClick();
  }, [shouldFetchItems]);

  return (
    <div className="flex flex-col gap-4 h-screen p-4">
      <h1 className="text-5xl font-bold">Items</h1>
      <div className="grid grid-cols-3 gap-4 max-h-[500px] overflow-y-auto">
        {items.map((item: any) => (
          <div key={item.id} className="border p-4 rounded-md">
            <h2>{item.name}</h2>
            <p>{item.description}</p>
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
