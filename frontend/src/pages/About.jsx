import { motion } from 'framer-motion';
import Tape from '../components/Tape';
import HandwrittenNote from '../components/HandwrittenNote';
import { EDITORIAL_STORIES } from '../data/fashionProducts';

const About = () => {
  return (
    <main className="min-h-screen bg-[#FAF7F2] pt-28 sm:pt-36 pb-24 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="border-b border-[#2C2A29]/15 pb-8 mb-12 relative">
          <div className="absolute -top-3 right-6 pointer-events-none hidden sm:block">
            <Tape rotate="-1deg" variant="kraft" text="ATELIER DOSSIER" width="w-36" />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#7A756F]">
              DOCUMENT NO. 00 • MANIFESTO &amp; TEXTILE ETHOS
            </span>
            <span className="font-handwriting text-base text-[#A66551]">
              (handwritten principles)
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl font-normal text-[#191817]">
            THE ATELIER MANIFESTO
          </h1>
          <p className="font-sans text-sm text-[#5C5751] font-light mt-2 max-w-xl">
            A quiet rejection of fast trends in pursuit of single-origin textiles, bespoke craftsmanship, and garments that develop character over a lifetime.
          </p>
        </div>

        {/* 3 Physical Story Cards (Provenance, Craftsmanship, Endurance) */}
        <div className="space-y-16">
          {EDITORIAL_STORIES.map((story, idx) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FDFCF9] p-6 sm:p-10 border border-[#2C2A29]/15 shadow-sm relative"
            >
              {/* Washi Tape */}
              <div className="absolute -top-3.5 left-8 pointer-events-none">
                <Tape
                  rotate={idx % 2 === 0 ? '-2deg' : '2deg'}
                  variant={idx % 2 === 0 ? 'kraft' : 'dark'}
                  text={story.step}
                  width="w-36"
                />
              </div>

              {/* Textile Specimen Area */}
              <div className={`lg:col-span-5 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="aspect-[4/5] bg-[#F4EFE6] border border-[#2C2A29]/15 p-6 flex flex-col justify-between relative overflow-hidden shadow-inner">
                  {/* Subtle paper texture overlay */}
                  <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#191817_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                  {/* Top registry stamp */}
                  <div className="flex items-center justify-between border-b border-[#2C2A29]/10 pb-3">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#7A756F]">
                      SPECIMEN NO. 0{idx + 1}
                    </span>
                    <span className="font-mono text-[8px] uppercase tracking-widest px-2 py-0.5 bg-[#191817] text-[#FAF7F2]">
                      CERTIFIED
                    </span>
                  </div>

                  {/* Specimen Typography Plate */}
                  <div className="my-auto py-6 text-center space-y-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#A66551] block">
                      {idx === 0 ? 'MULBERRY SILK WEAVE' : idx === 1 ? 'SUPER 130S SARTORIAL WOOL' : 'LONG-STAPLE BELGIAN LINEN'}
                    </span>
                    <h4 className="font-serif text-2xl sm:text-3xl text-[#191817] font-normal italic">
                      {idx === 0 ? '28 Momme Silk' : idx === 1 ? 'Neapolitan Suiting' : 'Sandwashed Flax'}
                    </h4>
                    <p className="font-mono text-[10px] text-[#7A756F] uppercase tracking-wider">
                      {idx === 0 ? 'Como, Lombardy • Italy' : idx === 1 ? 'Biella, Piedmont • Italy' : 'Kortrijk • Flanders'}
                    </p>
                  </div>

                  {/* Bottom Footer Details */}
                  <div className="border-t border-[#2C2A29]/10 pt-3 flex justify-between items-center font-mono text-[9px] text-[#7A756F] uppercase">
                    <span>100% SINGLE ORIGIN</span>
                    <span>ATELIER DOSSIER</span>
                  </div>
                </div>
              </div>

              {/* Story Narrative */}
              <div className={`lg:col-span-7 space-y-4 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#7A756F]">
                  CHAPTER {story.step}
                </span>

                <blockquote className="font-serif text-2xl sm:text-3xl text-[#191817] font-normal leading-snug">
                  “{story.quote}”
                </blockquote>

                <div className="pt-2">
                  <p className="font-mono text-xs font-bold text-[#191817]">
                    {story.author}
                  </p>
                  <p className="font-sans text-xs text-[#7A756F]">
                    {story.role}
                  </p>
                </div>

                <div className="pt-3">
                  <HandwrittenNote
                    text={
                      idx === 0
                        ? 'draped for Deepika Padukone at Cannes'
                        : idx === 1
                        ? 'tailored for Ranveer Singh in our Bandra room'
                        : 'crafted for Shah Rukh Khan’s gala appearances'
                    }
                    color="text-[#A66551]"
                    rotate="-1deg"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Ethical Fabric Provenance Table */}
        <div className="mt-20 bg-[#F5EFE6] p-8 sm:p-12 border border-[#2C2A29]/15">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#2C2A29]/15">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#7A756F]">
                HERITAGE WEAVING &amp; TEXTILE REGISTRY
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#191817] font-normal">
                Where Our Textiles &amp; Silhouettes Are Born
              </h3>
            </div>
            <span className="font-handwriting text-base text-[#A66551] hidden sm:inline">
              100% single-origin provenance
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs text-[#2C2A29]">
            <div className="p-4 bg-[#FDFCF9] border border-[#2C2A29]/10">
              <span className="text-[#A66551] font-bold block mb-1">01 / MILAN &amp; NAPLES TAILORING</span>
              <p className="font-sans text-xs text-[#5C5751]">
                Bespoke tailoring studios, natural spalla camicia shoulders, and hand-finished pick lapels.
              </p>
            </div>
            <div className="p-4 bg-[#FDFCF9] border border-[#2C2A29]/10">
              <span className="text-[#A66551] font-bold block mb-1">02 / COMO &amp; LYON SILK MILLS</span>
              <p className="font-sans text-xs text-[#5C5751]">
                Mulberry silk 28 momme crepe de chine and lustrous silk velvet woven on heritage European looms.
              </p>
            </div>
            <div className="p-4 bg-[#FDFCF9] border border-[#2C2A29]/10">
              <span className="text-[#A66551] font-bold block mb-1">03 / BIELLA WOOL &amp; NORMANDY FLAX</span>
              <p className="font-sans text-xs text-[#5C5751]">
                Pure cashmere, Super 130s extra-fine virgin wool, and long-staple French Normandy flax linen.
              </p>
            </div>
          </div>
        </div>

        {/* Public Exhibition, Pinterest Curation & Fair-Use Copyright Statement */}
        <div className="mt-12 bg-[#FDFCF9] p-8 sm:p-10 border border-[#2C2A29]/15 relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#7A756F]">
              DOCUMENT NO. 04 • EDITORIAL FAIR USE &amp; PUBLIC EXHIBITION POLICY
            </span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl text-[#191817] font-normal mb-3">
            Imagery Curation &amp; Intellectual Property Notice
          </h3>

          <div className="space-y-3 font-sans text-xs text-[#5C5751] font-light leading-relaxed max-w-4xl">
            <p>
              <strong>Public Exhibition:</strong> All garments and lookbooks curated through ELORA are exhibited publicly for artistic storytelling, portfolio demonstration, and style exploration.
            </p>
            <p>
              <strong>Moodboard Curation &amp; Pinterest References:</strong> Photographic references and moodboard imagery curated by administrators are sourced from public creative networks (including Pinterest and open digital archives) solely under non-commercial fair-use for aesthetic curation and creative context.
            </p>
            <p>
              <strong>Copyright Protection:</strong> All original photography, trademarks, model rights, and brand designs remain the sole intellectual property of their original creators and fashion houses. No copyright infringement is intended. If you are an intellectual property holder and wish to request immediate removal or attribution adjustment, please contact our administrator desk.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default About;
