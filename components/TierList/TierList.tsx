import React from "react";
import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "@/utils/database.types";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Box, Container } from "@mui/material";

type Decks = Database["public"]["Tables"]["decks"]["Row"];

export const TierListPage = () => {
  const supabase = useSupabaseClient<Database>();
  const [decks, setDecks] = useState<Decks[]>([]);
  const [state, setState] = useState<any>([]);
  const [editable, setEditable] = useState<boolean>(false);

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

    // Sort decks within each group by "elo"
    for (const tier in grouped) {
      grouped[tier].sort((a: any, b: any) => b.elo - a.elo);
    }

    // Convert grouped decks to an array
    return Object.keys(grouped).map((tier) => ({
      tier,
      decks: grouped[tier],
    }));
  }

  function transformData(inputData: Decks[]) {
    return inputData.map((item) => ({
      id: item.deck_id || "",
      name: item.deck_name || "",
      tier: item.tier || "",
      elo: item.elo || "",
    }));
  }
  const grid = 8;

  const getItemStyle = (isDragging: any, draggableStyle: any) => ({
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    background: isDragging ? "lightgreen" : "grey",
    ...draggableStyle,
  });

  const getListStyle = (isDraggingOver: any) => ({
    background: isDraggingOver ? "white" : "lightgrey",
    padding: grid,
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
    }
  }

  const toggleEditable = () => {
    setEditable(!editable);
  };

  const saveChanges = async () => {
    setEditable(false);
  };

  if (editable) {
    return (
      <div>
        <title>TierList Component</title>
        <div style={{ display: "flex" }}>
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
                        <h2>{el.tier}</h2>
                        {el.decks &&
                          el.decks.map((item: any, index: any) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
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
                                    {item.name}
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
        <div className="items-center">
          <button onClick={saveChanges}>Save</button>
          <button onClick={toggleEditable}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <title>TierList Component</title>
      <button onClick={toggleEditable}>Edit</button>

      <div style={{ display: "flex" }}>
        <Container>
          {state.map((el: any, ind: any) => {
            return (
              <Container key={ind}>
                <div
                  style={{
                    padding: grid * 2,
                    margin: `0 0 ${grid}px 0`,
                    background: "grey",
                  }}
                >
                  <h2>{el.tier}</h2>
                  {el.decks &&
                    el.decks.map((item: any, index: any) => (
                      <Container key={item.id}>
                        <div
                          style={{
                            padding: grid * 2,
                            margin: `0 0 ${grid}px 0`,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-around",
                              background: "lightgrey",
                            }}
                          >
                            {item.name}
                          </div>
                        </div>
                      </Container>
                    ))}
                </div>
              </Container>
            );
          })}
        </Container>
      </div>
    </div>
  );
};
