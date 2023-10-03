import Settings from "@mui/icons-material/Settings";
import { AppBar } from "@mui/material";

import * as React from "react";
import { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import Link from "next/link";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "@/utils/database.types";
//import { Session, User } from "@supabase/gotrue-js/src/lib/types";

import AvatarImage from "../AvatarImage";

type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

interface Session {
  /**
   * The oauth provider token. If present, this can be used to make external API requests to the oauth provider used.
   */
  provider_token?: string | null;
  /**
   * The oauth provider refresh token. If present, this can be used to refresh the provider_token via the oauth provider's API.
   * Not all oauth providers return a provider refresh token. If the provider_refresh_token is missing, please refer to the oauth provider's documentation for information on how to obtain the provider refresh token.
   */
  provider_refresh_token?: string | null;
  /**
   * The access token jwt. It is recommended to set the JWT_EXPIRY to a shorter expiry value.
   */
  access_token: string;
  /**
   * A one-time used refresh token that never expires.
   */
  refresh_token: string;
  /**
   * The number of seconds until the token expires (since it was issued). Returned when a login is confirmed.
   */
  expires_in: number;
  /**
   * A timestamp of when the token will expire. Returned when a login is confirmed.
   */
  expires_at?: number;
  token_type: string;
  user: User;
}

interface User {
  id: string;
  app_metadata: {};
  user_metadata: {};
  aud: string;
  confirmation_sent_at?: string;
  recovery_sent_at?: string;
  email_change_sent_at?: string;
  new_email?: string;
  new_phone?: string;
  invited_at?: string;
  action_link?: string;
  email?: string;
  phone?: string;
  created_at: string;
  confirmed_at?: string;
  email_confirmed_at?: string;
  phone_confirmed_at?: string;
  last_sign_in_at?: string;
  role?: string;
  updated_at?: string;
  identities?: [];
  factors?: [];
}

const pages = ["Decks"];
const userSettings = ["Accounts"];

export default function Navbar() {
  const supabase = useSupabaseClient<Database>();
  const [session, setSession] = useState<any>();

  const [user, setUser] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [userAvatar, setUserAvatar] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch user
        //const { data: userData } = await supabase.session.getUser();
        const { data: sessionData, error } = await supabase.auth.getSession();
        console.log("session data", sessionData);

        const user_id = sessionData.session?.user?.id;

        if (sessionData) {
          setSession(sessionData.session);
        } else {
          setSession(null);
        }

        // Fetch user avatars
        if (user_id && session) {
          const {
            data: avatarData,
            error,
            status,
          } = await supabase
            .from("profiles")
            .select(`avatar_url`)
            .eq("id", user_id)
            .single();

          if (error && status !== 406) {
            throw error;
          }

          if (avatarData) {
            setUserAvatar(avatarData.avatar_url);
            //console.log("avatar url : ", avatarData.avatar_url);
          }
        }
      } catch (error) {
        alert("Error loading user data!");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    console.log("navbar useEffect");
    fetchData();
  }, [supabase]);

  const [anchorNav, setAnchorNav] = React.useState<null | HTMLElement>(null);
  const [anchorUserMenu, setAnchorUserMenu] =
    React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorUserMenu(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorUserMenu(null);
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#474747",
      },
      secondary: {
        main: "#474747",
        light: "#F5EBFF",
        contrastText: "#fff",
      },
    },
  });

  return (
    <div>
      {!loading && (
        <ThemeProvider theme={theme}>
          <AppBar position="static" color="primary" enableColorOnDark>
            <Container maxWidth="xl">
              <Toolbar disableGutters>
                <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                  <AdbIcon
                    sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
                  />
                  <Typography
                    variant="h6"
                    noWrap
                    component="a"
                    href="#app-bar-with-responsive-menu"
                    sx={{
                      mr: 2,
                      display: { xs: "none", md: "flex" },
                      fontFamily: "monospace",
                      fontWeight: 700,
                      letterSpacing: ".3rem",
                      color: "inherit",
                      textDecoration: "none",
                    }}
                  >
                    TCG-Tracker
                  </Typography>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorNav}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    open={Boolean(anchorNav)}
                    onClose={handleCloseNavMenu}
                    sx={{
                      display: { xs: "block", md: "none" },
                    }}
                  >
                    {pages.map((page) => (
                      <MenuItem key={page}>
                        <Link href={`/${page}`} passHref>
                          <Typography color="primary" textAlign="center">
                            {page}
                          </Typography>
                        </Link>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
                <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
                <Typography
                  variant="h5"
                  noWrap
                  component="a"
                  href="#app-bar-with-responsive-menu"
                  sx={{
                    mr: 2,
                    display: { xs: "flex", md: "none" },
                    flexGrow: 1,
                    fontFamily: "monospace",
                    fontWeight: 700,
                    letterSpacing: ".3rem",
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  TCG-Tracker
                </Typography>
                <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                  {pages.map((page) => (
                    <Button
                      key={page}
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      {page}
                    </Button>
                  ))}
                </Box>
                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      {userAvatar ? (
                        <AvatarImage avatarUrl={userAvatar} size={40} />
                      ) : (
                        <Settings />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorUserMenu}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorUserMenu)}
                    onClose={handleCloseUserMenu}
                  >
                    {userSettings.map((setting) => (
                      <MenuItem key={setting} onClick={handleCloseUserMenu}>
                        <Link href={`/${setting}`} passHref>
                          <Typography color="primary" textAlign="center">
                            {setting}
                          </Typography>
                        </Link>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              </Toolbar>
            </Container>
          </AppBar>
        </ThemeProvider>
      )}
    </div>
  );
}
