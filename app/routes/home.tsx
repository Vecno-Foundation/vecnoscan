import Dashboard from "../Dashboard";

export function meta() {
  return [
    { title: "Vecnoscan | Track Blocks & Transactions" },
    {
      name: "description",
      content: "Vecnoscan. Track transactions, blocks, miners, and the BlockDAG in real-time.",
    },
    { name: "keywords", content: "Vecno explorer, Vecnoscan, blockchain tracker, Vecno blocks, transactions, miners, DAG" },
  ];
}

export default function Home() {
  return (
    <div className="text-base">
      <Dashboard />
    </div>
  );
}
