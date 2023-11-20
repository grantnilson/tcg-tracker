import { InputLabel } from "@mui/material";

import React from "react";
import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "@/utils/database.types";

type Decks = Database["public"]["Tables"]["decks"]["Row"];

export const GameReportPage = () => {
  const supabase = useSupabaseClient<Database>();
  const [decks, setDecks] = useState<Decks[]>([]);

  useEffect(() => {
    const fetchDecks = async () => {
      const { data: decks, error } = await supabase
        .from("decks")
        .select("*")
        .order("tier");

      if (error) console.log("error : ", error);
      else {
        setDecks(decks);
      }
    };

    fetchDecks();
  }, [supabase]);

  return <div>Game Report</div>;
};
