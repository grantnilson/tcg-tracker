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
  const [newELO, setNewELO] = useState("");
  const [errorText, setErrorText] = useState("");
  return <div></div>;
}

const Deck = ({ deck, onDelete }: { deck: Decks; onDelete: () => void }) => {};
