import VeLink from "../VeLink";
import DonateBox from "../layout/DonateBox";
import AnimatedBackground from "../layout/AnimatedBackground";

const DONATION_ADDRESS =
  "vecno:qqtsqwxa3q4aw968753rya4tazahmr7jyn5zu7vkncqlvk2aqlsdsah9ut65e";

export function meta() {
  return [
    { title: "Donate to Support | Vecnoscan" },
    {
      name: "description",
      content:
        "Support Vecnoscan and help us maintain and improve this open-source Vecno blockchain explorer. Every donation matters.",
    },
    {
      name: "keywords",
      content:
        "Vecno donate, support explorer, Vecnoscan donation, contribute to blockchain explorer, open-source",
    },
  ];
}

export default function Donate() {
  return (
    <DonateBox>
      <AnimatedBackground />
      <div className="relative pt-24 sm:pt-28 lg:pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400 leading-tight">
                Support Vecnoscan Development
              </h1>
              <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                <p>
                  Vecno is built by a passionate and dedicated community of people from all backgrounds, working together to
                  make it the best it can be. It’s a project that thrives on the time, talent, and creativity of countless
                  individuals who believe in what we’re building.
                </p>
                <p>
                  We rely on the amazing support of this community to keep going. Your donations help us cover the essentials
                  and give us the chance to keep pushing boundaries, exploring new ideas, and making Vecno even better.
                </p>
              </div>

              <div className="pt-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Your support keeps this explorer alive and improving.
                </h2>
                <p className="text-gray-300 mb-6">
                  Please consider donating any amount — every VE helps:
                </p>

                <div className="p-5 bg-white/5 border border-cyan-800/40 rounded-2xl backdrop-blur-xl hover:bg-white/10 transition-all">
                  <VeLink
                    linkType="address"
                    link
                    to={DONATION_ADDRESS}
                    copy
                    qr
                    className="block"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DonateBox>
  );
}