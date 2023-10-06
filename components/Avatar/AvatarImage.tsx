import React, { useEffect, useState, useMemo } from "react";
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

  const downloadImage = useMemo(
    () => async (path: string) => {
      try {
        const { data, error } = await supabase.storage
          .from("avatars")
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
    if (avatarUrl) downloadImage(avatarUrl);
    console.log("avatar image use effect render");

    // Cleanup when the component unmounts or when avatarUrl changes
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [avatarUrl, downloadImage]);

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
