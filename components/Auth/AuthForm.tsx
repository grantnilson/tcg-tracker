"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/utils/database.types";
import { createClient } from "@supabase/supabase-js";
import { SocialLayout, ThemeSupa, ViewType } from "@supabase/auth-ui-shared";
import { Auth } from "@supabase/auth-ui-react";
import { useState } from "react";
import { ToggleButton } from "@mui/material";
import { Menu } from "@mui/icons-material";

const colors = [
  "rgb(202, 37, 37)",
  "rgb(65, 163, 35)",
  "rgb(8, 107, 177)",
  "rgb(235, 115, 29)",
] as const;

const socialAlignments = ["horizontal", "vertical"] as const;

const radii = ["5px", "10px", "20px"] as const;

const views: { id: ViewType; title: string }[] = [
  { id: "sign_in", title: "Sign In" },
  { id: "sign_up", title: "Sign Up" },
  { id: "magic_link", title: "Magic Link" },
  { id: "forgotten_password", title: "Forgotten Password" },
  { id: "update_password", title: "Update Password" },
  { id: "verify_otp", title: "Verify Otp" },
];

export default function AuthForm() {
  const supabase = createClientComponentClient<Database>();

  return (
    <Auth
      supabaseClient={supabase}
      view="sign_in"
      appearance={{ theme: ThemeSupa }}
      theme="dark"
      showLinks={false}
      providers={[]}
      redirectTo="/Accounts"
    />
  );
}
