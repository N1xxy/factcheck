const topicPalettes = [
  {
    surface: "bg-cyan-50/55",
    header: "bg-cyan-50/85",
    border: "border-cyan-100",
    badge: "border-cyan-200 bg-cyan-50 text-cyan-800",
  },
  {
    surface: "bg-emerald-50/55",
    header: "bg-emerald-50/85",
    border: "border-emerald-100",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  {
    surface: "bg-amber-50/55",
    header: "bg-amber-50/85",
    border: "border-amber-100",
    badge: "border-amber-200 bg-amber-50 text-amber-800",
  },
  {
    surface: "bg-rose-50/45",
    header: "bg-rose-50/75",
    border: "border-rose-100",
    badge: "border-rose-200 bg-rose-50 text-rose-800",
  },
  {
    surface: "bg-violet-50/45",
    header: "bg-violet-50/75",
    border: "border-violet-100",
    badge: "border-violet-200 bg-violet-50 text-violet-800",
  },
  {
    surface: "bg-lime-50/55",
    header: "bg-lime-50/85",
    border: "border-lime-100",
    badge: "border-lime-200 bg-lime-50 text-lime-800",
  },
  {
    surface: "bg-sky-50/55",
    header: "bg-sky-50/85",
    border: "border-sky-100",
    badge: "border-sky-200 bg-sky-50 text-sky-800",
  },
  {
    surface: "bg-teal-50/55",
    header: "bg-teal-50/85",
    border: "border-teal-100",
    badge: "border-teal-200 bg-teal-50 text-teal-800",
  },
];

const topicPaletteBySlug: Record<string, (typeof topicPalettes)[number]> = {
  healthcare: topicPalettes[0],
  "research-healthcare": topicPalettes[0],
  education: topicPalettes[1],
  "research-education": topicPalettes[1],
  housing: topicPalettes[2],
  environment: topicPalettes[3],
  "research-energy": topicPalettes[3],
  transparency: topicPalettes[4],
  "research-eu-security": topicPalettes[6],
};

function hashSlug(slug: string) {
  return [...slug].reduce(
    (hash, character) => hash + character.charCodeAt(0),
    0,
  );
}

export function getTopicPalette(slug: string) {
  return topicPaletteBySlug[slug] ?? topicPalettes[hashSlug(slug) % topicPalettes.length];
}
