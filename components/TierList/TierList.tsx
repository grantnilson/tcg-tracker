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
        .order("time_added", { ascending: true });

      if (error) console.log("error : ", error);
      else {
        setDecks(decks);
        setState([transformData(decks)]);
      }
    };

    fetchDecks();
  }, [supabase]);

  console.log("decks : ", decks);

  function transformData(inputData: Decks[]) {
    return inputData.map((item) => ({
      id: item.deck_id || "",
      name: item.deck_name || "",
      tier: item.tier || "",
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
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? "lightgreen" : "grey",

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  const getListStyle = (isDraggingOver: any) => ({
    background: isDraggingOver ? "white" : "lightgrey",
    padding: grid,
    width: 250,
  });

  //const [state, setState] = useState([transformData(decks)]);
  console.log("state:", state);

  function onDragEnd(result: any) {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
      newState[sInd] = items;
      setState(newState);
    } else {
      const result = move(state[sInd], state[dInd], source, destination);
      const newState = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      setState(newState.filter((group) => group.length));
    }
  }

  return (
    <div>
      <title>TierList Component</title>
      <button
        type="button"
        onClick={() => {
          setState([...state, []]);
        }}
      >
        Add new group
      </button>
      <div style={{ display: "flex" }}>
        <DragDropContext onDragEnd={onDragEnd}>
          {state.map((el: any, ind: any) => (
            <Droppable key={ind} droppableId={`${ind}`}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                >
                  {el.map((item: any, index: any) => (
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
                            <button
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
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
};
