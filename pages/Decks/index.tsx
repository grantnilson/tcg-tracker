import React, { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import {
  createClientComponentClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Session } from "@supabase/auth-helpers-react";
import DeckList from "../../components/Deck/DeckList";

interface SupabaseSessionData {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: any; // You might want to create a User interface or type as well
}

export default function Decks() {
  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      <DeckList />
    </div>
  );
}
