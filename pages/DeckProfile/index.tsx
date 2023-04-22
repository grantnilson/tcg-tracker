import { useSession } from "@supabase/auth-helpers-react";
import GetDeckProfile from "@/components/DeckProfile";
import React from "react";

type Props = {};

export default function DeckProfile() {
  const session = useSession();

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      {!session ? (
        <div>Error no logged in session</div>
      ) : (
        <GetDeckProfile session={session} />
      )}
    </div>
  );
}
