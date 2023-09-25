import React, { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "../utils/database.types";
import Image from "next/image";
type Decks = Database["public"]["Tables"]["decks"]["Row"];

export default function DeckAvatar({
  uid,
  url,
  size,
  onUpload,
}: {
  uid: string;
  url: Decks["deck_image_url"];
  size: number;
  onUpload: (url: string) => void;
}) {
  const supabase = useSupabaseClient<Database>();
  const [deckAvatarUrl, setDeckAvatarUrl] =
    useState<Decks["deck_image_url"]>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function downloadDeckImage(path: string) {
      try {
        const { data, error } = await supabase.storage
          .from("deckAvatars")
          .download(path);
        if (error) {
          console.log("download path error", error);
          throw error;
        }
        const url = URL.createObjectURL(data);

        // Check if the new URL is different from the current state value
        if (url !== deckAvatarUrl) {
          setDeckAvatarUrl(url);
        }
      } catch (error) {
        console.log("Error downloading image: ", error);
      }
    }

    if (url) downloadDeckImage(url);
  }, [url, supabase]);

  const uploadDeckAvatar: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const timestamp = Date.now();

      const fileName = `${uid}_${timestamp}.${fileExt}`;
      const filePath = `${fileName}`;
      console.log("filepath : ", filePath);
      console.log("file : ", file);

      let { error: uploadError } = await supabase.storage
        .from("deckAvatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.log("upload error");
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error) {
      alert("Error uploading deck avatar!");
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {deckAvatarUrl ? (
        <Image
          src={deckAvatarUrl}
          alt="DeckAvatar"
          className="deck avatar image"
          width={size}
          height={size}
        />
      ) : (
        <div
          className="deck avatar no-image"
          style={{ height: size, width: size }}
        />
      )}
      <div style={{ width: size }}>
        <label className="button primary block" htmlFor="single">
          {uploading ? "Uploading ..." : "Upload"}
        </label>
        <input
          style={{
            visibility: "hidden",
            position: "absolute",
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadDeckAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  );
}
