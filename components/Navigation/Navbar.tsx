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

import AvatarImage from "../AvatarImage";

type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

const pages = ["Decks"];
const userSettings = ["Accounts"];

export default function Navbar() {
  const supabase = useSupabaseClient<Database>();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [userAvatar, setUserAvatar] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch user
        const { data: userData } = await supabase.auth.getUser();
        if (userData && userData.user) {
          setUser(userData.user);
        } else {
          setUser(null);
        }

        // Fetch user avatar
        if (userData && userData.user) {
          const {
            data: avatarData,
            error,
            status,
          } = await supabase
            .from("profiles")
            .select(`avatar_url`)
            .eq("id", userData.user.id)
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
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="primary" enableColorOnDark>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
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
                  <AvatarImage avatarUrl={userAvatar} size={40} />
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
  );
}
