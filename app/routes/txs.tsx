import { redirect } from "react-router-dom";

export async function loader() {
  return redirect("/transactions");
}

export default function TxsRedirect() {
  return null; // never renders
}
