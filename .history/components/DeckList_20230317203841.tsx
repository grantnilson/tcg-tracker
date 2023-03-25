import { useState, useEffect } from "react";
import {
  useUser,
  useSupabaseClient,
  Session,
} from "@supabase/auth-helpers-react";
import { Database } from "../utils/database.types";

type Profiles = Database["public"]["Tables"]["decks"]["Row"];

export default function DeckList({ session }: { session: Session }) {
  return <div></div>;
}