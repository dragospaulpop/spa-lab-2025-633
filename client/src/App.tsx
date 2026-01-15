import { useState } from "react";
import { Button } from "./components/ui/button";
import ItemsPage from "./items-page";
import SignUpForm from "./sign-up-form";

function App() {
  const [page, setPage] = useState<"items" | "sign-up">("items");


  return (
    <div className="p-4 space-x-4">
      <Button onClick={() => setPage("items")}>Show Items Page</Button>
      <Button onClick={() => setPage("sign-up")}>Show Sign Up Page</Button>

      {page === "items" ? <ItemsPage /> : <SignUpForm />}
    </div>
  );
}

export default App;
