import GradientMesh from "@/components/GradientMesh";
import BentoGrid from "@/components/BentoGrid";
import BentoCard from "@/components/BentoCard";
import HeroCard from "@/components/HeroCard";
import ShayariCard from "@/components/ShayariCard";
import SongPlayer from "@/components/SongPlayer";
import Polaroid from "@/components/Polaroid";
import PhotoCarousel from "@/components/PhotoCarousel";
import Link from "next/link";
import Image from "next/image";

const sportsPhotos = [
  { src: "/images/photos/tennis.jpg", alt: "Sarvesh playing tennis", caption: "Tennis, my happy place" },
  { src: "/images/photos/cricket.jpg", alt: "Sarvesh at IPL match", caption: "Cricket, RCB forever" },
  { src: "/images/photos/tennis-duo.jpg", alt: "Sarvesh with tennis partner", caption: "Post match smiles" },
];

const shayaris = [
  {
    text: "बेसब्र, बेखबर, बेइंतहां यू ही चलता जा रहा।\nकुछ पाने की आस लिए यू ही भटकता जा रहा।।\nपहुंच जाना है उस मंज़िल के क़रीब जिसका कोई ठिकाना ना है।\nपर ये तो बता दो उसके बाद का फसाना क्या है।।",
    audio: "/audio/shayari-1.mp3",
  },
  {
    text: "उस हरकत-ए-शाम में तुम भी मत खो जाना\nउस मंज़र-ए-वतन में तुम भी मत भूल जाना\nये नीला समंदर नहीं, काला दलदल है ग़ालिब मियाँ\nतुम तो \"कमल\" की तरह ही खिल के आना",
    audio: "/audio/shayari-2.mp3",
  },
  {
    text: "उनके ईमान पर अर्ज़ करने की अब फ़ुर्सत नहीं है\nउनकी फ़ितरतों पर इशारा करने का अब खर्च नहीं है\nक्या हुआ ग़ालिब तुम्हारे उन बेइंतहाँ लफ़्ज़ो को\nअफ़सोस है या फिर बेबसी के हालातों की बेरहम चुप्पी!?",
    audio: "/audio/shayari-3.mp3",
  },
];

export default function HomePage() {
  // Pick a random shayari on each server render (changes per visit with ISR)
  const randomShayari = shayaris[Math.floor(Math.random() * shayaris.length)];
  // Pick a random sports photo
  const randomSport = sportsPhotos[Math.floor(Math.random() * sportsPhotos.length)];

  return (
    <>
      <GradientMesh />
      <BentoGrid>
        {/* Hero Card — 2x2 */}
        <BentoCard
          index={0}
          className="col-span-1 md:col-span-2 row-span-2"
        >
          <HeroCard />
        </BentoCard>

        {/* Latest Post — 2x1 (placeholder, wired up in Task 10) */}
        <BentoCard index={1} className="col-span-1 md:col-span-2 row-span-1">
          <Link href="/blog" className="block h-full p-6">
            <p className="text-xs font-mono text-primary uppercase tracking-wider mb-2">
              Latest Post
            </p>
            <h3 className="font-heading text-lg text-secondary mb-1">
              Coming soon...
            </h3>
            <p className="text-sm text-text/60">
              Blog posts powered by Notion CMS. Check back soon.
            </p>
          </Link>
        </BentoCard>

        {/* Shayari Spotlight — 1x2 */}
        <BentoCard index={2} className="col-span-1 row-span-2">
          <div className="h-full p-5 flex flex-col items-center justify-center">
            <p className="text-xs font-mono text-primary uppercase tracking-wider mb-3">
              Shayari
            </p>
            <ShayariCard
              text={randomShayari.text}
              audioSrc={randomShayari.audio}
              rotation={0}
            />
          </div>
        </BentoCard>

        {/* Now — 1x1 (placeholder, wired up in Task 10) */}
        <BentoCard index={3} className="col-span-1 row-span-1">
          <Link href="/now" className="block h-full p-6">
            <p className="text-xs font-mono text-primary uppercase tracking-wider mb-2">
              Now
            </p>
            <p className="text-sm text-text/70">
              What I&apos;m up to right now...
            </p>
          </Link>
        </BentoCard>

        {/* Song Player — 1x1 */}
        <BentoCard index={4} className="col-span-1 row-span-1">
          <div className="h-full p-5 flex items-center">
            <SongPlayer compact />
          </div>
        </BentoCard>

        {/* Sports — 1x1 */}
        <BentoCard index={5} className="col-span-1 row-span-1">
          <div className="h-full p-4 flex items-center justify-center">
            <Polaroid
              src={randomSport.src}
              alt={randomSport.alt}
              caption={randomSport.caption}
              rotation={-2}
            />
          </div>
        </BentoCard>

        {/* Ireland Carousel — 2x1 */}
        <BentoCard index={6} className="col-span-1 md:col-span-2 row-span-1">
          <PhotoCarousel />
        </BentoCard>

        {/* Connect — 1x1 */}
        <BentoCard index={7} className="col-span-1 row-span-1">
          <div className="h-full p-6 flex flex-col justify-center items-center text-center">
            <p className="text-xs font-mono text-primary uppercase tracking-wider mb-3">
              Connect
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/in/sarvesh-khimesra/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Image src="/icons/linkedin.svg" alt="LinkedIn" width={20} height={20} />
              </a>
              <a
                href="https://www.instagram.com/sarveshrf/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Image src="/icons/instagram.svg" alt="Instagram" width={20} height={20} />
              </a>
              <a
                href="https://x.com/SKhimesra"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Image src="/icons/twitter.svg" alt="Twitter" width={20} height={20} />
              </a>
            </div>
          </div>
        </BentoCard>
      </BentoGrid>
    </>
  );
}
