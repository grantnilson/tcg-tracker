import React, { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "../../utils/database.types";
import Image from "next/image";
type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

interface AvatarImageProps {
  avatarUrl: Profiles["avatar_url"];
  size: number;
}

export default function AvatarImage({ avatarUrl, size }: AvatarImageProps) {
  const supabase = useSupabaseClient<Database>();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage
          .from("avatars")
          .download(path);
        if (error) {
          console.log("download path error", error);
          throw error;
        }
        const url = URL.createObjectURL(data);

        // Check if the new URL is different from the current state value
        if (url !== avatarUrl) {
          setImageUrl(url);
        }
      } catch (error) {
        console.log("Error downloading image: ", error);
      }
    }
    console.log("avatar image useEffect");
    if (avatarUrl) downloadImage(avatarUrl);
  }, [avatarUrl, supabase]);

  return imageUrl ? (
    <Image
      loading="lazy"
      src={imageUrl}
      alt="Avatar"
      className="avatar image"
      width={size}
      height={size}
    />
  ) : (
    <div className="avatar no-image" style={{ height: size, width: size }} />
  );
}
