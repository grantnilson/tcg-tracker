import { useState, useEffect } from "react";
import {
  useUser,
  useSupabaseClient,
  Session,
} from "@supabase/auth-helpers-react";
import { Database } from "../utils/database.types";

type Decks = Database["public"]["Tables"]["decks"]["Row"];

export default function DeckList({ session }: { session: Session }) {
  const supabase = useSupabaseClient<Database>();
  const [decks, setDecks] = useState<Decks[]>([]);
  const [deckName, setDeckName] = useState("");
  const [errorText, setErrorText] = useState("");

  const user = session.user;

  useEffect(() => {
    const fetchDecks = async () => {
      const { data: decks, error } = await supabase.from("decks").select("*");

      if (error) console.log("error : ", error);
      else setDecks(decks);
    };

    fetchDecks();
  }, [supabase]);

  const addDeck = async (deckName: string) => {
    let deckItem = deckName.trim();
    if (deckItem.length) {
      const { data: deck, error } = await supabase
        .from("decks")
        .insert({ deck_name: deckItem })
        .select()
        .single();

      if (error) {
        setErrorText(error.message);
      } else {
        setDecks([...decks, deck]);
        setDeckName("");
      }
    }
  };

  const deleteDeck = async (id: number) => {
    try {
      await supabase.from("decks").delete().eq("id", id).throwOnError();
      setDecks(decks.filter((x) => x.id != id));
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="w-full">
      <h1 className="mb-12"> Deck List .</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addDeck(deckName);
        }}
        className="flex gap-2 my-2"
      >
        <input
          className="rounded w-full p-2"
          type="text"
          placeholder="make coffee"
          value={deckName}
          onChange={(e) => {
            setErrorText("");
            setDeckName(e.target.value);
          }}
        />
        <button className="btn-black" type="submit">
          Add
        </button>
      </form>
      {!!errorText && <Alert text={errorText} />}
      <div className="bg-white shadow overflow-hidden rounded-md">
        <ul>
          {decks.map((deck) => (
            <Deck
              key={deck.id}
              deck={deck}
              onDelete={() => deleteDeck(deck.id)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

const Deck = ({ deck, onDelete }: { deck: Decks; onDelete: () => void }) => {
  const supabase = useSupabaseClient<Database>();
  //const [isCompleted, setIsCompleted] = useState(deck.is_complete)

  return (
    <li className="w-full block cursor-pointer hover:bg-gray-200 focus:outline-none focus:bg-gray-200 transition duration-150 ease-in-out">
      <div className="flex items-center px-4 py-4 sm:px-6">
        <div className="min-w-0 flex-1 flex items-center">
          <div className="text-sm leading-5 font-medium truncate">
            {deck.deck_name}
          </div>
        </div>
        <div>
          <input
            className="cursor-pointer"
            //onChange={(e) => toggle()}
            type="checkbox"
            //checked={isCompleted ? true : false}
          />
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete();
          }}
          className="w-4 h-4 ml-2 border-2 hover:border-black rounded"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="gray"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </li>
  );
};

const Alert = ({ text }: { text: string }) => (
  <div className="rounded-md bg-red-100 p-4 my-3">
    <div className="text-sm leading-5 text-red-700">{text}</div>
  </div>
);
