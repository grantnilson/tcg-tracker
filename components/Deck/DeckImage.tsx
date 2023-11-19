import React, { useEffect, useState, useMemo } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "../../utils/database.types";
import Image from "next/image";
type Decks = Database["public"]["Tables"]["decks"]["Row"];

interface DeckImageProps {
  deckUrl: Decks["deck_image_url"];
  size: number;
}

export default function DeckImage({ deckUrl, size }: DeckImageProps) {
  const supabase = useSupabaseClient<Database>();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const downloadImage = useMemo(
    () => async (path: string) => {
      try {
        const { data, error } = await supabase.storage
          .from("deckAvatars")
          .download(path);
        if (error) {
          console.log("download path error", error);
          throw error;
        }
        const url = URL.createObjectURL(data);
        setImageUrl(url);
      } catch (error) {
        console.log("Error downloading image: ", error);
      }
    },
    [supabase]
  );

  useEffect(() => {
    if (deckUrl) downloadImage(deckUrl);
    // Cleanup when the component unmounts or when avatarUrl changes
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [deckUrl, downloadImage]);

  return imageUrl ? (
    <Image
      loading="lazy"
      src={imageUrl}
      alt="DeckImage"
      className="deck image"
      width={size}
      height={size}
    />
  ) : (
    <div className="deck no-image" style={{ height: size, width: size }} />
  );
}
