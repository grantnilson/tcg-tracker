import React from "react";
import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "@/utils/database.types";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { transform } from "typescript";

type Decks = Database["public"]["Tables"]["decks"]["Row"];

export const TierListPage = () => {
  const supabase = useSupabaseClient<Database>();
  const [decks, setDecks] = useState<Decks[]>([]);
  const [state, setState] = useState<any>([]);

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
        //setState([transformData(decks)]);
        const groupedDecks = groupAndSortDecks(decks);
        console.log(groupedDecks);
        setState(groupedDecks);
      }
    };

    fetchDecks();
  }, [supabase]);

  function groupAndSortDecks(decks: Decks[]): any[] {
    const grouped: any = {};

    decks.forEach((deck) => {
      const tier = deck.tier || "Unsorted"; // Default to "Unsorted" if no tier
      if (!grouped[tier]) {
        grouped[tier] = [];
      }
      grouped[tier].push(transformData([deck])[0]); // Apply the same transformation
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

  const reorder = (decks: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(decks);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const move = (
    source: any[],
    destination: any[],
    droppableSource: { droppableId: number; index: number },
    droppableDestination: { droppableId: number; index: number }
  ) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result: Record<number, any[]> = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
  };

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
      // Reordering within the same group
      const group = newState[sourceIndex];
      const [draggedItem] = group.decks.splice(source.index, 1);
      group.decks.splice(destination.index, 0, draggedItem);
    } else {
      // Moving from one group to another
      const sourceGroup = newState[sourceIndex];
      const destGroup = newState[destIndex];
      const [draggedItem] = sourceGroup.decks.splice(source.index, 1);
      destGroup.decks.splice(destination.index, 0, draggedItem);
    }
  }

  return (
    <div>
      <title>TierList Component</title>
      <button
        type="button"
        onClick={() => {
          setState([...state, { tier: "New Group", decks: [] }]);
        }}
      >
        Add new group
      </button>
      <div style={{ display: "flex" }}>
        <DragDropContext onDragEnd={onDragEnd}>
          {/* {console.log("state : ", state)} */}
          {state.map((el: any, ind: any) => {
            // console.log("el: ", el);
            return (
              <Droppable key={ind} droppableId={`${ind}`}>
                {(provided, snapshot) => {
                  // console.log("provided: ", provided);
                  // console.log("snapshot", snapshot);
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
                                  {/* <button
                                  type="button"
                                  onClick={() => {
                                    const newState = [...state];
                                    newState[ind].splice(index, 1);
                                    setState(
                                      newState.filter((group) => group.length)
                                    );
                                  }}
                                >
                                  delete
                                </button> */}
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
    </div>
  );
};
