import ShayariCard from "@/components/ShayariCard";
import ShayariText from "@/components/ShayariText";
import SongPlayer from "@/components/SongPlayer";
import Polaroid from "@/components/Polaroid";
import Image from "next/image";

const shayaris = [
  {
    text: "बेसब्र, बेखबर, बेइंतहां यू ही चलता जा रहा।\nकुछ पाने की आस लिए यू ही भटकता जा रहा।।\nपहुंच जाना है उस मंज़िल के क़रीब जिसका कोई ठिकाना ना है।\nपर ये तो बता दो उसके बाद का फसाना क्या है।।",
    audio: "/audio/shayari-1.mp3",
    rotation: -1.5,
  },
  {
    text: "उस हरकत-ए-शाम में तुम भी मत खो जाना\nउस मंज़र-ए-वतन में तुम भी मत भूल जाना\nये नीला समंदर नहीं, काला दलदल है ग़ालिब मियाँ\nतुम तो \"कमल\" की तरह ही खिल के आना",
    audio: "/audio/shayari-2.mp3",
    rotation: 0.5,
  },
  {
    text: "उनके ईमान पर अर्ज़ करने की अब फ़ुर्सत नहीं है\nउनकी फ़ितरतों पर इशारा करने का अब खर्च नहीं है\nक्या हुआ ग़ालिब तुम्हारे उन बेइंतहाँ लफ़्ज़ो को\nअफ़सोस है या फिर बेबसी के हालातों की बेरहम चुप्पी!?",
    audio: "/audio/shayari-3.mp3",
    rotation: -0.8,
  },
];

const sportsPolaroids = [
  {
    src: "/images/photos/tennis.jpg",
    alt: "Sarvesh playing tennis",
    caption: "Tennis, my happy place",
    rotation: -3,
  },
  {
    src: "/images/photos/cricket.jpg",
    alt: "Sarvesh at IPL match in RCB jersey",
    caption: "Cricket, RCB forever",
    rotation: 2,
  },
  {
    src: "/images/photos/tennis-duo.jpg",
    alt: "Sarvesh with tennis partner",
    caption: "Post match smiles",
    rotation: -1.5,
  },
];

const irelandPhotos = [
  { src: "/images/photos/IMG_8226.jpg", alt: "Irish village vibes", caption: "Irish village vibes", rotation: -2 },
  { src: "/images/photos/IMG_8033.jpg", alt: "Sheep, lakes & solitude", caption: "Sheep, lakes & solitude", rotation: 1.5 },
  { src: "/images/photos/IMG_8254.jpg", alt: "Wild Atlantic coast", caption: "Wild Atlantic coast", rotation: -1 },
  { src: "/images/photos/IMG_8218.jpg", alt: "Murphy's Bar", caption: "Murphy's Bar, cheers!", rotation: 2.5 },
  { src: "/images/photos/IMG_8402.jpg", alt: "Old Ireland", caption: "Old Ireland, still standing", rotation: -1.5 },
  { src: "/images/photos/ireland-group.jpg", alt: "Winter squad", caption: "Winter squad", rotation: 1 },
  { src: "/images/photos/IMG_6775.jpg", alt: "Dublin at blue hour", caption: "Dublin at blue hour", rotation: -2 },
  { src: "/images/photos/IMG_7532.jpg", alt: "Ice skating vibes", caption: "Ice skating vibes", rotation: 1.5 },
  { src: "/images/photos/IMG_7444.jpg", alt: "Rocky Irish coastline", caption: "Where the land meets the sea", rotation: -1 },
  { src: "/images/photos/IMG_7721.jpg", alt: "Irish countryside stream", caption: "Countryside wandering", rotation: 2 },
  { src: "/images/photos/IMG_8870.jpg", alt: "Sarvesh having a Guinness", caption: "First Guinness, won't be the last", rotation: 0.5 },
  { src: "/images/photos/IMG_7949.jpg", alt: "Sarvesh at seaside pier", caption: "By the harbour", rotation: -1.5 },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-24 pb-20">
      {/* About Me */}
      <section className="mb-16">
        <h1 className="font-heading text-4xl text-secondary mb-8">
          So, who&apos;s this guy?
        </h1>
        <div className="bg-parchment rounded-xl p-5 sm:p-8 shadow-md space-y-4 text-base leading-relaxed">
          <p>
            I&apos;ve always been curious about too many things at once. Right now I&apos;m
            spending most of my time with{" "}
            <strong className="text-primary">AI</strong>, playing around with
            tools like Claude Code and Codex, trying to turn random ideas into
            actual features and products.
          </p>
          <p>
            I&apos;m excited about the field that lies at the intersection of{" "}
            <strong className="text-primary">
              AI, GTM, and strategy
            </strong>
            . That&apos;s where I want to build.
          </p>
          <p>
            I&apos;m also not just a tech person. I spent time preparing for
            UPSC and that shaped how I think.{" "}
            <strong className="text-primary">
              Multidisciplinary, curious, always connecting dots
            </strong>{" "}
            across history, economics, and culture. I love finding patterns in
            unexpected places.
          </p>
          <p>
            If any of this resonates with you, or you just want to have a
            conversation about life, ideas, or anything in between, I&apos;d
            love to hear from you.
          </p>
        </div>
      </section>

      {/* What I'm Building */}
      <section className="mb-16">
        <h2 className="font-heading text-3xl text-secondary mb-6">
          What I&apos;m building
        </h2>
        <div className="bg-white rounded-xl p-5 sm:p-8 shadow-md">
          <p className="text-base leading-relaxed mb-6">
            I think the best way to learn AI is to just build stuff with it. So
            that&apos;s what I&apos;m doing.
          </p>
          <div className="space-y-5">
            <div>
              <strong className="text-primary text-lg">AI Experiments</strong>
              <p className="text-sm text-text/85 mt-1">
                I take rough ideas and try to turn them into working prototypes
                using Claude Code, Codex, and whatever tool makes sense.
              </p>
            </div>
            <div>
              <strong className="text-primary text-lg">GTM + AI</strong>
              <p className="text-sm text-text/85 mt-1">
                I&apos;m really interested in how AI is changing go-to-market.
                Positioning, outreach, product-led growth, all of it.
              </p>
            </div>
            <div>
              <strong className="text-primary text-lg">
                Looking for my tribe
              </strong>
              <p className="text-sm text-text/85 mt-1">
                If you&apos;re building something at the intersection of AI and
                business, I&apos;d genuinely love to hear from you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shayari */}
      <section className="mb-16">
        <h2 className="font-heading text-3xl text-secondary mb-1 text-center">
          {"\u092E\u0947\u0930\u0940 \u0936\u093E\u092F\u0930\u0940"}
        </h2>
        <p className="text-sm text-accent tracking-wider text-center mb-8">
          click to listen, in my voice
        </p>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {shayaris.map((s, i) => (
            <ShayariCard
              key={i}
              text={s.text}
              audioSrc={s.audio}
              rotation={s.rotation}
            />
          ))}
        </div>
      </section>

      {/* More Shayaris — text only */}
      <section className="mb-16">
        <h2 className="font-heading text-3xl text-secondary mb-1 text-center">
          और कुछ लफ़्ज़...
        </h2>
        <p className="text-sm text-accent tracking-wider text-center mb-8">
          just words, no voice needed
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 justify-items-center">
          <ShayariText
            text={"वक़्त रहते हुए सब लिखा जाएगा\nउन सब यादों का हिसाब मांगा जाएगा"}
            rotation={-1}
          />
          <ShayariText
            text={"कभी फुर्सत में बैठेंगे तब ज़िक्र करेंगे\nइतनी भी नफ़रत नहीं की कुछ पल नहीं हैं उनके लिए"}
            rotation={0.5}
          />
          <ShayariText
            text={"अब मेरी लिखी हुई शायरी किसको सुनाओं\nदर्शक तुम प्रेरक तुम अब किसको ये बतलाओं"}
            rotation={-0.8}
          />
          <ShayariText
            text={"बुझे हुए दिल को बुझा ही रहने दो\nहलचल की तो राखों से भी आग निकलेगी"}
            rotation={1.5}
          />
<ShayariText
            text={"मैंने चाँद को काफ़ी नज़दीक से देखा है\nइसका रंग- रूप सब बदलते देखा है"}
            rotation={1}
          />
          <ShayariText
            text={"जा देख लिया है तुझे, अब जहन्नूँ की क़ब्र में\nअच्छा लगता है ना लपटों के बीच ज़िंदगी जाता देख।"}
            rotation={-1.2}
          />
          <ShayariText
            text={"इश्क़ की आदत का मलाल ज़िंदगी ज़्यादा रखती है, वरना एर-गैर आदतें तो कई दफ़ा भुलाई है"}
            rotation={0.8}
          />
          <ShayariText
            text={"एक दफ़ा माना था तुम ही ज़िंदगी हो, पर तुमने ही एहसास करा दिया की ये ही ज़िंदगी है"}
            rotation={-0.5}
          />
          <ShayariText
            text={"यूँ ना पूछ मेरी ज़िंदगी का मकसद ए ख़ुदा, उनकी रूह की परछाइयों से खुद को ज़िंदा पता हूँ"}
            rotation={1.2}
          />
          <ShayariText
            text={"हर शक्स में ये नज़रे ढूँढ रही है तुम्हें जरा नज़रो को बोल\nदो इस दिल की तरह अब ठहर जाये"}
            rotation={-1}
          />
          <ShayariText
            text={"ज़िन्दगी साँसो से नहीं, उम्मीदों से बनती है मेरे दोस्तों\nपगडण्डी मिट्टी से नही, कदमो से बनती है मेरे दोस्तों\nरोशनी सूरज से नही, अंधेरो से भी आती है मेरे दोस्तों\nबातें ज़ुबा से ही नही, आँखों से भी होती है मेरे दोस्तों\nदूरी दूर से ही नहीं, पास होकर भी होती है मेरे दोस्तों\nयादेँ पुरानी होकर भी ताज़ा सी लगती है मेरे दोस्तों।।"}
            rotation={0}
          />
          <ShayariText
            text={"इश्क़ की आँधी से आया ज़हन में तूफ़ान मंज़ूर है\nइंद्रधनशु जैसे सुंदर हमारे प्यार के परवाने मंज़ूर हैं\n\nतो चलो अब नया आसमान चूमने, उस बेइंतहन मोहबतो की मिठास लेने\nऔर घुला दो इस इश्क़ की नदी को तुम्हारे प्यार के सागर में"}
            rotation={-0.8}
          />
        </div>
      </section>

      {/* Song Player */}
      <section className="mb-16 bg-gradient-to-br from-secondary to-[#0d1b2a] rounded-2xl p-6 sm:p-10 text-bg">
        <SongPlayer />
      </section>

      {/* Sports */}
      <section className="mb-16">
        <h2 className="font-heading text-3xl text-secondary mb-1 text-center">
          The sporty side
        </h2>
        <p className="text-sm text-accent tracking-wider text-center mb-8">
          if there&apos;s a ball and some competition, count me in
        </p>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {sportsPolaroids.map((p) => (
            <Polaroid
              key={p.src}
              src={p.src}
              alt={p.alt}
              caption={p.caption}
              rotation={p.rotation}
            />
          ))}
        </div>
      </section>

      {/* Ireland Photos */}
      <section className="mb-16">
        <h2 className="font-heading text-3xl text-secondary mb-1 text-center">
          Wanderlust &amp; history nerd
        </h2>
        <p className="text-sm text-accent tracking-wider text-center mb-8">
          Ireland in winter was everything and I want more
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-[880px] mx-auto">
          {irelandPhotos.map((p) => (
            <Polaroid
              key={p.src}
              src={p.src}
              alt={p.alt}
              caption={p.caption}
              rotation={p.rotation}
            />
          ))}
        </div>
      </section>

      {/* Connect */}
      <section className="text-center bg-gradient-to-br from-chai to-parchment rounded-2xl p-6 sm:p-10">
        <h2 className="font-heading text-3xl text-secondary mb-4">
          Let&apos;s connect
        </h2>
        <p className="text-base text-text mb-6">
          Whether it&apos;s about AI, strategy, shayari, tennis, travel,
          or just life in general, I&apos;m always up for a good conversation.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <a
            href="https://www.linkedin.com/in/sarvesh-khimesra/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white text-secondary font-medium shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all"
          >
            <Image src="/icons/linkedin.svg" alt="" width={20} height={20} />
            LinkedIn
          </a>
          <a
            href="https://www.instagram.com/sarveshrf/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white text-secondary font-medium shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all"
          >
            <Image src="/icons/instagram.svg" alt="" width={20} height={20} />
            Instagram
          </a>
          <a
            href="https://x.com/SKhimesra"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white text-secondary font-medium shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all"
          >
            <Image src="/icons/twitter.svg" alt="" width={20} height={20} />
            Twitter / X
          </a>
        </div>
        <p className="font-heading text-xl text-accent italic">
          &mdash; Sarvesh
        </p>
      </section>
    </div>
  );
}
