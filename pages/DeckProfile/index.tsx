import { useSession } from "@supabase/auth-helpers-react";
import GetDeckProfile from "@/components/DeckProfile";
import React from "react";

type Props = {};

export default function DeckProfile({}: Props) {
  const session = useSession();

  return (
    <div>
      <GetDeckProfile />
    </div>
  );
}
