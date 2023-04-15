import React from "react";
import { useState, useEffect } from "react";
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
  //console.log("value of deckId: " + router.query.deckId);
  const routerDeckId = router.query.deckId;
  console.log("value of deckId: " + routerDeckId);
  const supabase = useSupabaseClient<Database>();
  const [deck, setDeck] = useState<Deck[]>([]);

  useEffect(() => {
    const fetchDeck = async () => {
      const { data: deck, error } = await supabase
        .from("decks")
        .select("*")
        .match({ deck_id: routerDeckId })
        .single();

      if (error) console.log("error : ", error);
      else setDeck(deck);
    };
    //console.log("value of deck is : " + deck);

    fetchDeck();
  }, [supabase, , deck]);

  return (
    <div className="w-full">
      Deck Profile
      <div></div>
    </div>
  );
}
