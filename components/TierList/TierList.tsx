import React from "react";
import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "@/utils/database.types";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Box, Container } from "@mui/material";
import DeckAvatar from "../Deck/DeckAvatar";
import { EditAttributesOutlined } from "@mui/icons-material";

type Decks = Database["public"]["Tables"]["decks"]["Row"];

export const TierListPage = () => {
  const supabase = useSupabaseClient<Database>();
  const [decks, setDecks] = useState<Decks[]>([]);
  const [state, setState] = useState<any>([]);
  const [editable, setEditable] = useState<boolean>(false);
  const [flexDirection, setFlexDirection] = useState<any>("column");
  const [changedDecks, setChangedDecks] = useState<any>([]);

  const addToChangedDecks = (newObject: any) => {
    setChangedDecks((prevData: any) => {
      // Check if a deck with the same ID already exists in prevData
      const existingDeckIndex = prevData.findIndex(
        (deck: any) => deck.deck_id === newObject.deck_id
      );
      if (existingDeckIndex !== -1) {
        // If a deck with the same ID already exists, replace it
        prevData[existingDeckIndex] = newObject;
      } else {
        // Otherwise, add the newObject to the changed decks
        prevData.push(newObject);
      }
      return [...prevData]; // Return a new array to trigger a state update
    });
  };

  useEffect(() => {
    //console.log("changed decks: ", changedDecks);
  }, [changedDecks]);

  useEffect(() => {
    const fetchDecks = async () => {
      const { data: decks, error } = await supabase
        .from("decks")
        .select("*")
        .order("tier")
        .order("time_added", { ascending: true });

      if (error) console.log("error : ", error);
      else {
        setDecks(decks);
        const groupedDecks = groupAndSortDecks(decks);
        setState(groupedDecks);
      }
    };

    fetchDecks();
  }, [supabase]);

  function groupAndSortDecks(decks: Decks[]): any[] {
    const grouped: any = {};

    decks.forEach((deck) => {
      const tier = deck.tier || "Unsorted";
      if (!grouped[tier]) {
        grouped[tier] = [];
      }
      grouped[tier].push(transformData([deck])[0]);
    });

    for (const tier in grouped) {
      grouped[tier].sort((a: any, b: any) => b.elo - a.elo);
    }

    return Object.keys(grouped).map((tier) => ({
      tier,
      decks: grouped[tier],
    }));
  }

  function transformData(inputData: Decks[]) {
    return inputData.map((item) => ({
      deck_id: item.deck_id || "",
      deck_name: item.deck_name || "",
      tier: item.tier || "",
      elo: item.elo || null,
    }));
  }

  const grid = 8;

  const getItemStyle = (isDragging: any, draggableStyle: any) => ({
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    border: "2px solid transparent",
    box: "border-box",
    background: isDragging ? "lightgreen" : "grey",
    ...draggableStyle,
  });

  const getListStyle = (isDraggingOver: any) => ({
    background: isDraggingOver ? "white" : "lightgrey",
    padding: `0 ${grid}px`,
    opacity: "inherit",
    transition: "background-color 0.2s ease 0s, opacity 0.1s ease 0s",
    border: "8px",
    margin: "8px",
    width: 250,
  });

  function onDragEnd(result: any) {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    const sourceIndex = +source.droppableId;
    const destIndex = +destination.droppableId;
    const newState = [...state];

    if (sourceIndex === destIndex) {
      const group = newState[sourceIndex];
      const [draggedItem] = group.decks.splice(source.index, 1);
      group.decks.splice(destination.index, 0, draggedItem);
    } else {
      const sourceGroup = newState[sourceIndex];
      const destGroup = newState[destIndex];
      const [draggedItem] = sourceGroup.decks.splice(source.index, 1);
      destGroup.decks.splice(destination.index, 0, draggedItem);
      //console.log("destination", destGroup);
      draggedItem.tier = destGroup.tier;
      addToChangedDecks(draggedItem);
    }
  }

  const toggleEditable = () => {
    setEditable(!editable);
  };

  const saveChanges = async () => {
    console.log("changed decks: ", changedDecks);

    const { data, error } = await supabase
      .from("decks")
      .upsert(changedDecks)
      .select();

    console.log("here");
    setEditable(!editable);
  };

  const toggleFlexDirection = () => {
    setFlexDirection(flexDirection === "column" ? "row" : "column");
  };

  return (
    <div style={{}}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "right",
        }}
      >
        <title>TierList Component</title>
        <div style={{ display: "inline-block", float: "right" }}>
          <button className="my-2" onClick={toggleFlexDirection}>
            Toggle Direction
          </button>
        </div>
        {!editable && (
          <div style={{ display: "inline-block", float: "right" }}>
            <button className="my-2" onClick={toggleEditable}>
              Edit
            </button>
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection }}>
        <DragDropContext onDragEnd={onDragEnd}>
          {state.map((el: any, ind: any) => {
            return (
              <Droppable key={ind} droppableId={`${ind}`}>
                {(provided, snapshot) => {
                  return (
                    <div
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}
                      {...provided.droppableProps}
                    >
                      <h2>Tier : {el.tier}</h2>
                      {el.decks &&
                        el.decks.map((item: any, index: any) => (
                          <Draggable
                            key={item.deck_id}
                            draggableId={item.deck_id}
                            index={index}
                            isDragDisabled={!editable}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style
                                )}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-around",
                                  }}
                                >
                                  {item.deck_name}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>
            );
          })}
        </DragDropContext>
      </div>
      {editable && (
        <div className="items-center">
          <button onClick={saveChanges}>Save</button>
          <button onClick={toggleEditable}>Cancel</button>
        </div>
      )}
    </div>
  );
};
