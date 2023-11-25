import React from "react";
import { useState, useEffect, useRef } from "react";
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
  const [selectedDeck2, setSelectedDeck2] = useState<string>("");
  const [winningDeck, setWinningDeck] = useState<string>("");
  const selectedDeck1Ref = useRef<string>(selectedDeck1);
  const selectedDeck2Ref = useRef<string>(selectedDeck2);
  const winningDeckRef = useRef<string>(winningDeck);

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

  const handleFirstChange = (event: any) => {
    const selectedValue = event.target.value as string;
    //console.log("selected val: ", selectedValue);

    if (decks.some((item) => item.deck_name === selectedValue)) {
      setSelectedDeck1((prevSelectedDeck) => {
        if (prevSelectedDeck !== selectedValue) {
          selectedDeck1Ref.current = selectedValue;
        }
        return selectedValue;
      });
    }

    //console.log("selected deck 1: ", selectedDeck1Ref.current);
  };

  const handleSecondChange = (event: any) => {
    const selectedValue = event.target.value as string;
    //console.log("selected val: ", selectedValue);

    if (decks.some((item) => item.deck_name === selectedValue)) {
      setSelectedDeck2((prevSelectedDeck) => {
        if (prevSelectedDeck !== selectedValue) {
          selectedDeck2Ref.current = selectedValue;
        }
        return selectedValue;
      });
    }

    //console.log("selected deck 2: ", selectedDeck2Ref.current);
  };

  const handleWinningDeck = (event: any) => {
    const selectedValue = event.target.value as string;
    //console.log("selected val: ", selectedValue);

    if (decks.some((item) => item.deck_name === selectedValue)) {
      setWinningDeck((prevSelectedDeck) => {
        if (prevSelectedDeck !== selectedValue) {
          winningDeckRef.current = selectedValue;
        }
        return selectedValue;
      });
    }

    //console.log("winning deck: ", winningDeckRef.current);
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
        <Box style={{ paddingTop: "10px", minWidth: 120 }}>
          {decks && decks != undefined ? (
            <div>
              <FormControl fullWidth>
                <InputLabel
                  id="demo-simple-select-label"
                  sx={{
                    color: theme.palette.secondary.light,
                  }}
                >
                  First Deck
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Deck 1"
                  value={selectedDeck1}
                  onChange={handleFirstChange}
                  sx={{
                    borderBlockColor: theme.palette.secondary.contrastText,
                  }}
                >
                  {decks.map((item: any) => (
                    <MenuItem
                      sx={{ color: theme.palette.secondary.contrastText }}
                      key={item.deck_name}
                      value={item.deck_name}
                    >
                      <Typography color="primary">{item.deck_name}</Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {selectedDeck1 !== "" && (
                <FormControl fullWidth>
                  <InputLabel
                    id="demo-simple-select-label2"
                    sx={{
                      color: theme.palette.secondary.light,
                    }}
                  >
                    Second Deck
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label2"
                    id="demo-simple-select2"
                    label="Deck 2"
                    value={selectedDeck2}
                    onChange={handleSecondChange}
                    sx={{
                      borderBlockColor: theme.palette.secondary.contrastText,
                    }}
                  >
                    {decks
                      .filter((item: any) => item.deck_name !== selectedDeck1)
                      .map((item: any) => {
                        return (
                          <MenuItem
                            sx={{ color: theme.palette.secondary.contrastText }}
                            key={item.deck_name}
                            value={item.deck_name}
                          >
                            <Typography color="primary">
                              {item.deck_name}
                            </Typography>
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              )}
              {selectedDeck1 !== "" && selectedDeck2 != "" && (
                <FormControl fullWidth>
                  {" "}
                  <InputLabel
                    id="demo-simple-select-label3"
                    sx={{
                      color: theme.palette.secondary.light,
                    }}
                  >
                    Winner
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label3"
                    id="demo-simple-select3"
                    label="Deck 2"
                    value={winningDeck}
                    onChange={handleWinningDeck}
                    sx={{
                      borderBlockColor: theme.palette.secondary.contrastText,
                    }}
                  >
                    <MenuItem
                      sx={{ color: theme.palette.secondary.contrastText }}
                      value={selectedDeck1}
                    >
                      <Typography color="primary">{selectedDeck1}</Typography>
                    </MenuItem>
                    <MenuItem
                      sx={{ color: theme.palette.secondary.contrastText }}
                      value={selectedDeck2}
                    >
                      <Typography color="primary">{selectedDeck2}</Typography>
                    </MenuItem>
                  </Select>
                </FormControl>
              )}
            </div>
          ) : (
            <div>No Decks Loaded</div>
          )}
        </Box>
      </ThemeProvider>
    </div>
  );
};
