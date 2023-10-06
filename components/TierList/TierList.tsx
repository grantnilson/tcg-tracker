import React from "react";
import { useState, useEffect, useRef } from "react";
import {
  useUser,
  useSupabaseClient,
  Session,
} from "@supabase/auth-helpers-react";
import { Database } from "@/utils/database.types";
import { useRouter } from "next/router";

type Decks = Database["public"]["Tables"]["decks"]["Row"];

export const TierListPage = () => {
  const supabase = useSupabaseClient<Database>();
  const [decks, setDecks] = useState<Decks[]>([]);
  const [deckName, setDeckName] = useState("");
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    const fetchDecks = async () => {
      const { data: decks, error } = await supabase
        .from("decks")
        .select("*")
        .order("time_added", { ascending: true });

      if (error) console.log("error : ", error);
      else setDecks(decks);
    };

    fetchDecks();
    console.log("decks : ", decks);
  }, [supabase]);

  return <div>TierList Component</div>;
};
