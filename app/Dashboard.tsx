import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import SearchBox from "./header/SearchBox";
import { StatsBar } from "./StatsBar";
import AnimatedBackground from "./layout/AnimatedBackground";

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [hideArrow, setHideArrow] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setHideArrow(latest > 80);
  });

  return (
    <>
      <AnimatedBackground />
      <div className="relative min-h-screen flex flex-col">
        <header className="fixed inset-x-0 top-0 z-[100] px-6 pt-6 lg:px-8 pointer-events-none">
          <div className="max-w-7xl mx-auto pointer-events-auto">
            <StatsBar />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center px-6 pt-32 pb-20 md:pt-24">
          <motion.section
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 }}
            className="text-center relative z-10"
          >
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-100 to-blue-400 drop-shadow-2xl leading-tight">
              Explore the blockchain
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.9 }}
              className="mt-8 text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-200 font-light max-w-4xl mx-auto leading-relaxed"
            >
              Vecno is a <span className="text-cyan-400 font-bold">fast</span>, open-source, decentralized & fully scalable{" "}
              <span className="text-cyan-300 font-semibold">Layer-1 PoW</span> network.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-12 w-full max-w-xl mx-auto px-4 sm:px-0"
            >
              <SearchBox
                value={search}
                onChange={setSearch}
                placeholder="Search blocks, transactions, addresses..."
                className="w-full shadow-2xl"
              />
            </motion.div>
          </motion.section>
        </main>
        <motion.div
          initial={{ opacity: 0.6 }}
          animate={{ opacity: hideArrow ? 0 : 0.6 }}
          transition={{ duration: 0.5 }}
          className="pointer-events-none fixed bottom-8 left-1/2 -translate-x-1/2 z-50 hidden sm:block"
        >
          <motion.div
            animate={{ y: hideArrow ? 16 : 0 }}
            transition={{ duration: 0.4 }}
            className="animate-bounce"
          >
            <svg className="w-8 h-8 text-cyan-400 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default Dashboard;