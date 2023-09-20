import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSupabaseClient, Session } from "@supabase/auth-helpers-react";
import { Database } from "../utils/database.types";
import { useRouter } from "next/router";
import DeckAvatar from "./DeckAvatar";

type Deck = Database["public"]["Tables"]["decks"]["Row"];

interface DeckProfileCardProps {
  deck: EditableDeck;
  deckId: string | undefined;
}

interface EditableDeck {
  deck_name: string | null;
  elo: number | null;
  tier: string | null;
  time_added: string;
}

export function DeckProfileCard({ deck, deckId }: DeckProfileCardProps) {
  const [isEditable, setIsEditable] = useState(false);
  const [editableDeck, setEditableDeck] = useState(deck);

  const [loading, setLoading] = useState(false);
  const supabase = useSupabaseClient<Database>();

  useEffect(() => {}, [editableDeck]);

  async function updateDeckProfile() {
    try {
      setLoading(true);
      if (!deck) throw new Error("No deck");
      if (!deckId) throw new Error("No deckID");

      let { data, error } = await supabase
        .from("decks")
        .update({
          deck_name: editableDeck.deck_name,
          elo: editableDeck.elo,
          tier: editableDeck.tier,
        })
        .eq("deck_id", deckId)
        .select("deck_name, tier, elo");

      if (error) throw error;
      if (data) {
        const updatedDeck: EditableDeck = {
          deck_name: (data[0] as EditableDeck).deck_name,
          elo: (data[0] as EditableDeck).elo,
          tier: (data[0] as EditableDeck).tier,
          time_added: (data[0] as EditableDeck).time_added,
        };

        setEditableDeck(updatedDeck);
      } else {
        console.log("no data");
      }
      alert("Deck updated!");
    } catch (error) {
      alert("Error updating the data!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const toggleEditable = () => {
    setIsEditable(!isEditable);
  };

  const setUpdatedDeck = (name: string, value: string) => {
    setEditableDeck((prevState) => ({ ...prevState, [name]: value }));
  };

  const saveChanges = async () => {
    setIsEditable(false);
    await updateDeckProfile();
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
              onChange={(e) => {
                setUpdatedDeck(e.target.name, e.target.value);
              }}
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
              onChange={(e) => {
                setUpdatedDeck(e.target.name, e.target.value);
              }}
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
              onChange={(e) => {
                setUpdatedDeck(e.target.name, e.target.value);
              }}
              className="mb-4"
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
            <h1>{editableDeck.deck_name}</h1>
            <p>ELO: {editableDeck.elo}</p>
            <p>Tier: {editableDeck.tier}</p>
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
  const [isDeckImageLoading, setIsDeckImageLoading] = useState(true);
  const [deck_avatar_url, setDeckAvatarUrl] =
    useState<Deck["deck_image_url"]>(null);

  const memoizedDeckId = useMemo(() => {
    const deckId = router.query.deckId;
    return Array.isArray(deckId) ? deckId[0] : deckId;
  }, [router.query.deckId]);

  const isMountedRef = useRef(false);
  const rendersRef = useRef(0);

  async function updateDeckAvatar({
    deck_id,
    deck_image_url,
  }: {
    deck_id: Deck["deck_id"];
    deck_image_url: Deck["deck_image_url"];
  }) {
    try {
      setIsDeckImageLoading(true);
      if (!deck_id) throw new Error("No deck_id");
      console.log(deck_id);
      console.log(deck_image_url);

      let { data, error } = await supabase
        .from("decks")
        .update({
          deck_image_url: deck_image_url,
        })
        .eq("deck_id", deck_id);

      if (error) throw error;
      alert("Deck updated!");
    } catch (error) {
      alert("Error updating the data!");
      console.log(error);
    } finally {
      setIsDeckImageLoading(false);
    }
  }

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
            setDeckAvatarUrl(deck[0].deck_image_url);
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
    <div>
      {deck && (
        <div>
          <DeckAvatar
            uid={deck.deck_id}
            url={deck.deck_image_url}
            size={150}
            onUpload={(url) => {
              setDeckAvatarUrl(url);
              updateDeckAvatar({ deck_id: deck.deck_id, deck_image_url: url });
            }}
          />
        </div>
      )}
      <div className="w-full">
        {isLoading
          ? LoadingSpinner()
          : deck && <DeckProfileCard deck={deck} deckId={memoizedDeckId} />}
      </div>
    </div>
  );
}
