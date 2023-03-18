import { useState, useEffect } from "react";
import {
  useUser,
  useSupabaseClient,
  Session,
} from "@supabase/auth-helpers-react";
import { Database } from "../utils/database.types";
import Avatar from "./Avatar";

type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

export default function Deck({ session }: { session: Session }) {
  return <div></div>;
}
