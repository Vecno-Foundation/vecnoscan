import { redirect } from "react-router-dom";

export async function loader({ params }: { params: { id: string } }) {
  return redirect(`/transactions/${params.id}`);
}

export default function TxsIdRedirect() {
  return null;
}
