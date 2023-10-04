import { useSession } from "@supabase/auth-helpers-react";
import GetDeckProfile from "@/components/Deck/DeckProfile";
import React from "react";

export default function DeckProfile() {
  const session = useSession();
  console.log("deck profile index.tsx session : ", session);

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      {!session ? (
        <div>Error no logged in deck profile session</div>
      ) : (
        <GetDeckProfile session={session} />
      )}
    </div>
  );
}
