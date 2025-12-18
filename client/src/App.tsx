import { Button } from "@/components/ui/button";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import AddItemForm from "./add-item-form";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "./components/ui/item";

import type { DbItem } from "../../server/src/db/schema";
import { Toaster } from "./components/ui/sonner";

function App() {
  const [items, setItems] = useState<DbItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [shouldFetchItems, setShouldFetchItems] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleClick = () => {
    setLoading(true);
    fetch("http://localhost:3000/item")
      .then((response) => response.json())
      .then((data) => setItems(data.data))
      .catch((error) => console.error("Error:", error))
      .finally(() => setLoading(false));
  };

  const handleDelete = (id: string) => {
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
      <Toaster richColors />
      <h1 className="text-5xl font-bold">Items</h1>
      <div className="max-h-[500px] overflow-y-auto">
        <ItemGroup>
          {items.map((item, index) => (
            <Fragment key={item.id}>
              <Item>
                <ItemActions className="font-mono text-xs">
                  ${item.price}
                </ItemActions>
                <ItemContent className="gap-1">
                  <ItemTitle>{item.name}</ItemTitle>
                  <ItemDescription>{item.description}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                  >
                    {deletingId === item.id ? (
                      <Loader2Icon className="animate-spin" />
                    ) : (
                      <Trash2Icon className="text-destructive" />
                    )}
                  </Button>
                </ItemActions>
              </Item>
              {index !== items.length - 1 && <ItemSeparator />}
            </Fragment>
          ))}
        </ItemGroup>
      </div>
      <Button onClick={handleClick} variant="default">
        {loading ? "Loading..." : "Fetch items"}
      </Button>
      <AddItemForm onAdd={() => setShouldFetchItems(shouldFetchItems + 1)} />
    </div>
  );
}

export default App;
