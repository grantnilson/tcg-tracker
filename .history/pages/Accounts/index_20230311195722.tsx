import React from 'react'
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Account from "../../components/Account";

type Props = {}

export default function index({}: Props) {
    const session = useSession();
  return (
    <Account session={session}>
  )
}