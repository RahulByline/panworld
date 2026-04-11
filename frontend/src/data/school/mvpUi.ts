/** Helpers for MVP HTML parity (publisher tints, emoji tiles). */

export function pubClassFromPublisher(publisher: string): string {
  const n = publisher.toLowerCase();
  if (n.includes("mcgraw")) return "pub-mcgraw";
  if (n.includes("kodeit")) return "pub-kodeit";
  if (n.includes("studysync")) return "pub-studysync";
  if (n.includes("achieve")) return "pub-achieve";
  if (n.includes("oxford")) return "pub-oxford";
  if (n.includes("cambridge")) return "pub-cambridge";
  if (n.includes("pearson") || n.includes("savvas")) return "pub-pearson";
  if (n.includes("collins")) return "pub-collins";
  if (n.includes("power")) return "pub-powerschool";
  if (n.includes("jolly")) return "pub-jolly";
  return "pub-mcgraw";
}

export function stableEmoji(seed: string): string {
  const emojis = ["📗", "📐", "✏️", "💬", "📈", "📕", "📙", "🔬", "⚗️", "📝", "📚", "📖"];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return emojis[h % emojis.length]!;
}
