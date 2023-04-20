import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSupabaseClient, Session } from "@supabase/auth-helpers-react";
import { Database } from "../utils/database.types";
import { useRouter } from "next/router";

type Deck = Database["public"]["Tables"]["decks"]["Row"];

interface DeckProfileCardProps {
  deck: Deck;
}

export function DeckProfileCard({ deck }: DeckProfileCardProps) {
  return (
    <div>
      <h1>{deck.deck_name}</h1>
      <p>ELO: {deck.elo}</p>
      <p>Tier: {deck.tier}</p>
      <p>Added: {deck.time_added}</p>
    </div>
  );
}

function LoadingSpinner() {
  return <p>Loading...</p>;
}

export default function GetDeckProfile({ session }: { session: Session }) {
  const router = useRouter();
  const supabase = useSupabaseClient<Database>();

  const [deck, setDeck] = useState<Deck | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const memoizedDeckId = useMemo(
    () => router.query.deckId,
    [router.query.deckId]
  );

  const isMountedRef = useRef(false);
  const rendersRef = useRef(0);

  useEffect(() => {
    const renders = rendersRef.current;
    rendersRef.current++;
    isMountedRef.current = true;

    const fetchDeck = async () => {
      if (memoizedDeckId) {
        const { data: deck, error } = await supabase
          .from("decks")
          .select("*")
          .eq("deck_id", memoizedDeckId);

        if (error) {
          console.log("error: ", error);
        } else {
          if (isMountedRef.current) {
            setDeck(deck[0] || null);
            setIsLoading(false);
          }
        }
      }
    };

    fetchDeck();

    return () => {
      isMountedRef.current = false;
      console.log(`Component rendered ${renders + 1} time`);
    };
  }, [supabase, memoizedDeckId]);

  return (
    <div className="w-full">
      {isLoading ? LoadingSpinner() : deck && <DeckProfileCard deck={deck} />}
    </div>
  );
}
