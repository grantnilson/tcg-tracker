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
  const [deck_name, setDeck_Name] = useState<Decks[]>([]);
  const [decks, setDecks] = useState("");
  const [errorText, setErrorText] = useState("");

  const user = session.user;

  useEffect(() => {
    const fetchDecks = async () => {
      const { data: decks, error } = await supabase
        .from("decks")
        .select("*")
        .order("id", { ascending: true });
    };

    return () => {
      second;
    };
  }, [third]);

  return <div></div>;
}

const Deck = ({ deck, onDelete }: { deck: Decks; onDelete: () => void }) => {};
