"use client";

import { useState } from "react";
import { Play } from "lucide-react";

/** Lightweight YouTube embed: shows the cover and loads the iframe only on click (keeps Lighthouse happy). */
export function VideoCover({ youtubeId, title, label, children }: { youtubeId: string; title: string; label: string; children: React.ReactNode }) {
  const [play, setPlay] = useState(false);
  if (play) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-3xl bg-black">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <button type="button" onClick={() => setPlay(true)} className="group relative block w-full overflow-hidden rounded-3xl" aria-label={label}>
      {children}
      <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition group-hover:bg-black/30">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-lapis-800 shadow-2xl transition group-hover:scale-110">
          <Play className="ms-1 h-9 w-9 fill-current" />
        </span>
      </span>
    </button>
  );
}
