import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSupabaseClient, Session } from "@supabase/auth-helpers-react";
import { Database } from "../utils/database.types";
import { useRouter } from "next/router";

type Deck = Database["public"]["Tables"]["decks"]["Row"];

interface DeckProfileCardProps {
  deck: EditableDeck;
}

interface EditableDeck {
  deck_name: string | null;
  elo: number | null;
  tier: string | null;
  time_added: string;
}

export function DeckProfileCard({ deck }: DeckProfileCardProps) {
  const [isEditable, setIsEditable] = useState(false);
  const [editableDeck, setEditableDeck] = useState(deck);

  const toggleEditable = () => {
    setIsEditable(!isEditable);
    //console.log(editableDeck);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditableDeck({ ...editableDeck, [name]: value });
  };

  const saveChanges = () => {
    console.log("Saved changes:", editableDeck);
    setIsEditable(false);
  };

  if (isEditable) {
    return (
      <div className="flex-col items-center px-4 py-8 sm:px-6">
        <div className=" flex-col py-4 flex items-center">
          <div className="text-sm leading-5 font-medium flex-col py-8 w-full">
            <label className="block mb-2 text-gray-300" htmlFor="deck_name">
              Deck Name:
            </label>
            <input
              type="text"
              id="deck_name"
              name="deck_name"
              value={
                editableDeck.deck_name !== null ? editableDeck.deck_name : ""
              }
              onChange={handleInputChange}
              className="mb-4"
            />
            <label className="block mb-2 text-gray-300" htmlFor="elo">
              Elo:
            </label>
            <input
              type="text"
              id="elo"
              name="elo"
              value={editableDeck.elo !== null ? editableDeck.elo : ""}
              onChange={handleInputChange}
              className="mb-4"
            />
            <label className="block mb-2 text-gray-300" htmlFor="tier">
              Tier:
            </label>
            <input
              type="text"
              id="tier"
              name="tier"
              value={editableDeck.tier !== null ? editableDeck.tier : ""}
              onChange={handleInputChange}
              className="mb-4"
            />
            <label className="block mb-2 text-gray-300" htmlFor="time_added">
              Time Added:
            </label>
            <input
              type="text"
              id="time_added"
              name="time_added"
              value={
                editableDeck.time_added !== null ? editableDeck.time_added : ""
              }
              onChange={handleInputChange}
              className="mb-4 w-full"
            />
          </div>
        </div>
        <div className="items-center">
          <button onClick={saveChanges}>Save</button>
          <button onClick={toggleEditable}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full block cursor-pointerfocus:outline-none focus:bg-gray-200 transition duration-150 ease-in-out">
      <div className="flex items-center px-4 py-4 sm:px-6">
        <div className="min-w-0 flex-1 flex items-center">
          <div className="text-sm leading-5 font-medium truncate">
            <h1>{deck.deck_name}</h1>
            <p>ELO: {deck.elo}</p>
            <p>Tier: {deck.tier}</p>
            <p>Added: {deck.time_added}</p>
          </div>
        </div>
        <div>
          <button onClick={toggleEditable}>Edit</button>
        </div>
      </div>
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
