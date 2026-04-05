import ShayariText from "@/components/ShayariText";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Random Musings — Sarvesh Khimesra",
  description: "और कुछ लफ़्ज़ — random musings on love, realisation, life, and everything in between.",
};

const musings = {
  "इश्क़ — Love": [
    "इश्क़ की आदत का मलाल ज़िंदगी ज़्यादा रखती है, वरना एर-गैर आदतें तो कई दफ़ा भुलाई है",
    "एक दफ़ा माना था तुम ही ज़िंदगी हो, पर तुमने ही एहसास करा दिया की ये ही ज़िंदगी है",
    "यूँ ना पूछ मेरी ज़िंदगी का मकसद ए ख़ुदा, उनकी रूह की परछाइयों से खुद को ज़िंदा पता हूँ",
    "हर शक्स में ये नज़रे ढूँढ रही है तुम्हें जरा नज़रो को बोल\nदो इस दिल की तरह अब ठहर जाये",
"अब मेरी लिखी हुई शायरी किसको सुनाओं\nदर्शक तुम प्रेरक तुम अब किसको ये बतलाओं",
  ],
  "एहसास — Realisation": [
    "वक़्त रहते हुए सब लिखा जाएगा\nउन सब यादों का हिसाब मांगा जाएगा",
    "कभी फुर्सत में बैठेंगे तब ज़िक्र करेंगे\nइतनी भी नफ़रत नहीं की कुछ पल नहीं हैं उनके लिए",
    "मैंने चाँद को काफ़ी नज़दीक से देखा है\nइसका रंग- रूप सब बदलते देखा है",
  ],
  "आग — Fire": [
    "बुझे हुए दिल को बुझा ही रहने दो\nहलचल की तो राखों से भी आग निकलेगी",
    "जा देख लिया है तुझे, अब जहन्नूँ की क़ब्र में\nअच्छा लगता है ना लपटों के बीच ज़िंदगी जाता देख।",
  ],
  "ज़िंदगी — Life": [
    "ज़िन्दगी साँसो से नहीं, उम्मीदों से बनती है मेरे दोस्तों\nपगडण्डी मिट्टी से नही, कदमो से बनती है मेरे दोस्तों\nरोशनी सूरज से नही, अंधेरो से भी आती है मेरे दोस्तों\nबातें ज़ुबा से ही नही, आँखों से भी होती है मेरे दोस्तों\nदूरी दूर से ही नहीं, पास होकर भी होती है मेरे दोस्तों\nयादेँ पुरानी होकर भी ताज़ा सी लगती है मेरे दोस्तों।।",
  ],
};

const rotations = [-1, 0.5, -0.8, 1.5, -0.5, 1, -1.2, 0.8];

export default function MusingsPage() {
  let rotIndex = 0;

  return (
    <div className="max-w-4xl mx-auto px-6 pt-24 pb-20">
      <div className="mb-4">
        <Link href="/blog" className="text-sm text-primary hover:underline">
          &larr; back to blog
        </Link>
      </div>

      <h1 className="font-heading text-4xl text-secondary mb-2">
        Random Musings
      </h1>
      <p className="font-shayari text-xl text-accent mb-2">और कुछ लफ़्ज़...</p>
      <p className="text-text/60 text-sm mb-12">
        just words, no voice needed
      </p>

      {Object.entries(musings).map(([category, items]) => (
        <section key={category} className="mb-14">
          <h2 className="font-heading text-2xl text-secondary mb-6 border-b border-primary/20 pb-2">
            {category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 justify-items-center">
            {items.map((text, i) => {
              const rot = rotations[rotIndex % rotations.length];
              rotIndex++;
              return (
                <ShayariText key={i} text={text} rotation={rot} />
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
