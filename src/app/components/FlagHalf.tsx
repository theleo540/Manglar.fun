/**
 * Mismo patrón visual que FlagHalf en components/NextMatchCard.tsx de
 * WC2026Streams: divide un contenedor en diagonal con dos imágenes
 * (o un emoji de respaldo si no hay imagen). Se reusa aquí en el Hero
 * de manglar.fun para que el "próximo partido" se vea consistente en
 * todo el ecosistema.
 */
export function FlagHalf({
  image,
  name,
  clipPath,
  emojiAlign,
  emojiFallback = "🏳️",
}: {
  image?: string;
  name: string;
  clipPath: string;
  emojiAlign: "left" | "right";
  emojiFallback?: string;
}) {
  if (image) {
    return (
      <div
        className="absolute inset-0"
        style={{
          clipPath,
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className="absolute inset-0 bg-white/5 flex items-center"
      style={{
        clipPath,
        justifyContent: emojiAlign === "left" ? "flex-start" : "flex-end",
        paddingLeft: emojiAlign === "left" ? "8%" : 0,
        paddingRight: emojiAlign === "right" ? "8%" : 0,
      }}
      aria-hidden="true"
    >
      <span className="text-[6rem] md:text-[8rem] leading-none opacity-90">{emojiFallback}</span>
      <span className="sr-only">{name}</span>
    </div>
  );
}
