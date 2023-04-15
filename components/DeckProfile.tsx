import React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  useUser,
  useSupabaseClient,
  Session,
} from "@supabase/auth-helpers-react";
import { Database } from "../utils/database.types";
import Decks from "@/pages/Decks";
import { useRouter } from "next/router";

type Deck = Database["public"]["Tables"]["decks"]["Row"];

export default function GetDeckProfile({ session }: { session: Session }) {
  const router = useRouter();
  const supabase = useSupabaseClient<Database>();
  const [deck, setDeck] = useState<Deck[]>([]);

  useEffect(() => {
    if (!router.isReady) return;
    const getRouterId = router.query.deckId;
    console.log("value of deck id from query is : " + getRouterId);

    const fetchDeck = async () => {
      const { data: deck, error } = await supabase
        .from("decks")
        .select("*")
        .eq("deck_id", getRouterId);

      if (error) console.log("error : ", error);
      else setDeck(deck);
    };

    fetchDeck();
  }, [supabase, router.isReady, router.query.deckId]);

  console.log("dependency values : ");
  console.log("value of router.isReady : " + router.isReady);
  console.log("value of router.query.deckId : " + router.query.deckId);
  console.log("value of deck is  : " + JSON.stringify(deck));

  return (
    <div className="w-full">
      Deck Profile
      <div></div>
    </div>
  );
}
