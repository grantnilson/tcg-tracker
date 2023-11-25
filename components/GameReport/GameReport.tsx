import React from "react";
import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "@/utils/database.types";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Typography } from "@mui/material";
import { isTemplateExpression } from "typescript";

type Decks = Database["public"]["Tables"]["decks"]["Row"];

export const GameReportPage = () => {
  const supabase = useSupabaseClient<Database>();
  const [decks, setDecks] = useState<Decks[]>([]);
  const [selectedDeck1, setSelectedDeck1] = useState<string>("");
  const firstSelectedDeck = selectedDeck1;

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
    console.log("decks: ", decks);
  }, [supabase]);

  const handleChange = (event: SelectChangeEvent) => {
    console.log("event:", event);
    const selectedValue = event.target.value as string;
    console.log("selected val: ", selectedValue);

    // Check if the selectedValue is valid before updating the state
    if (decks.some((item) => item.deck_name === selectedValue)) {
      setSelectedDeck1(selectedValue);
    }

    console.log("selected deck 1: ", selectedDeck1);
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
      <ThemeProvider theme={theme}>
        <h2>Game Report</h2>
        <Box sx={{ minWidth: 120 }}>
          {decks && decks != undefined ? (
            <FormControl fullWidth>
              <InputLabel
                id="demo-simple-select-label"
                sx={{ color: theme.palette.getContrastText("#fff") }}
              >
                Decks
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Deck 1"
                value={selectedDeck1}
                onChange={handleChange}
                sx={{ color: theme.palette.getContrastText("#fff") }}
              >
                {decks.map((item: any) => (
                  <MenuItem
                    sx={{ color: theme.palette.getContrastText("#fff") }}
                    key={item.deck_name}
                  >
                    <Typography color="primary">{item.deck_name}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <div>no decks</div>
          )}
        </Box>
      </ThemeProvider>
    </div>
  );
};
