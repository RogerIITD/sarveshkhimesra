interface ShayariTextProps {
  text: string;
  rotation?: number;
}

export default function ShayariText({ text, rotation = 0 }: ShayariTextProps) {
  return (
    <div
      className="bg-parchment border border-primary/15 rounded-xl px-6 py-5 w-full max-w-[280px] text-center shadow-md hover:shadow-lg transition-shadow"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <p className="font-shayari text-sm leading-relaxed text-secondary whitespace-pre-line">
        {text}
      </p>
    </div>
  );
}
