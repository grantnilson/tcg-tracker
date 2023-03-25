import { useState, useEffect } from "react";
import {
  useUser,
  useSupabaseClient,
  Session,
} from "@supabase/auth-helpers-react";
import { Database } from "../utils/database.types";

type Decks = Database["public"]["Tables"]["decks"]["Row"];

export default function DeckList({ session }: { session: Session }) {
  const supabase = useSupabaseClient<Database>();
  const [decks, setDecks] = useState<Decks[]>([]);
  const [deckName, setDeckName] = useState("");
  const [errorText, setErrorText] = useState("");

  const user = session.user;

  useEffect(() => {
    const fetchDecks = async () => {
      const { data: decks, error } = await supabase
        .from("decks")
        .select("*")
        .order("id", { ascending: true });

      if (error) console.log("error : ", error);
      else setDecks(decks);
    };

    fetchDecks();
  }, [supabase]);

  const addDeck = async (deckName: string) => {
    let deckItem = deckName.trim();
    if (deckItem.length) {
      const { data: deck, error } = await supabase
        .from("decks")
        .insert({ deck_name: deckItem })
        .select()
        .single();

      if (error) {
        setErrorText(error.message);
      } else {
        setDecks([...decks, deck]);
        setDeckName("");
      }
    }
  };

  return <div></div>;
}

const Deck = ({ deck, onDelete }: { deck: Decks; onDelete: () => void }) => {};
