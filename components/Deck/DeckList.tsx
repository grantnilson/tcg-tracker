import { useState, useEffect } from "react";
import {
  useUser,
  useSupabaseClient,
  Session,
} from "@supabase/auth-helpers-react";
import { Database } from "@/utils/database.types";
import { useRouter } from "next/router";

type Decks = Database["public"]["Tables"]["decks"]["Row"];

export default function DeckList({ session }: { session: Session }) {
  const supabase = useSupabaseClient<Database>();
  const [decks, setDecks] = useState<Decks[]>([]);
  const [deckName, setDeckName] = useState("");
  //const [deckID, setDeckID] = useState("");
  const [errorText, setErrorText] = useState("");
  if (session == null) {
    console.log(" decklist session is null ");
  }

  const user = session.user;

  useEffect(() => {
    const fetchDecks = async () => {
      const { data: decks, error } = await supabase
        .from("decks")
        .select("*")
        .order("time_added", { ascending: true });

      if (error) console.log("error : ", error);
      else setDecks(decks);
    };

    fetchDecks();
  }, [supabase, decks]);

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

  const deleteDeck = async (deck_id: string) => {
    try {
      await supabase
        .from("decks")
        .delete()
        .eq("deck_id", deck_id)
        .throwOnError();
      setDecks(decks.filter((x) => x.deck_id != x.deck_id));
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="w-full">
      <h1 className="mb-12"> Deck List </h1>
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
          placeholder="Add Deck"
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
      <div className="shadow overflow-hidden rounded-md">
        <ul>
          {decks.map((deck) => (
            <Deck
              key={deck.deck_id}
              deck={deck}
              onDelete={() => deleteDeck(deck.deck_id)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

const Deck = ({ deck, onDelete }: { deck: Decks; onDelete: () => void }) => {
  const supabase = useSupabaseClient<Database>();
  const router = useRouter();

  return (
    <li className="w-full block cursor-pointer hover:bg-gray-600 focus:outline-none focus:bg-gray-200 transition duration-150 ease-in-out">
      <div className="flex items-center px-4 py-4 sm:px-6">
        <div className="min-w-0 flex-1 flex items-center">
          <div className="text-sm leading-5 font-medium truncate">
            {deck.deck_name}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            //console.log(deck.deck_id);
            router.push({
              pathname: "/DeckProfile",
              query: { deckId: deck.deck_id },
            });
          }}
          className=" ml-2 border-2 hover:border-black rounded"
        >
          Profile
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete();
          }}
          className=" ml-2 border-2 hover:border-black rounded"
        >
          Delete
        </button>
      </div>
    </li>
  );
};

const Alert = ({ text }: { text: string }) => (
  <div className="">
    <div className="">{text}</div>
  </div>
);
