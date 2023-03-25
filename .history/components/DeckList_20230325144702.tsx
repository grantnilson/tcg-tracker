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
      const { data: decks, error } = await supabase
        .from("decks")
        .select("*")
        .order("id", { ascending: true });

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
      await supabase.from('decks').delete().eq('id', id).throwOnError()
      setDecks(decks.filter((x) => x.id != id))
    } catch (error) {
      console.log('error', error)
    }
  }

  return <div className="w-full">
  <h1 className="mb-12">Todo List.</h1>
  <form
    onSubmit={(e) => {
      e.preventDefault()
      addTodo(newTaskText)
    }}
    className="flex gap-2 my-2"
  >
    <input
      className="rounded w-full p-2"
      type="text"
      placeholder="make coffee"
      value={newTaskText}
      onChange={(e) => {
        setErrorText('')
        setNewTaskText(e.target.value)
      }}
    />
    <button className="btn-black" type="submit">
      Add
    </button>
  </form>
  {!!errorText && <Alert text={errorText} />}
  <div className="bg-white shadow overflow-hidden rounded-md">
    <ul>
      {todos.map((todo) => (
        <Todo key={todo.id} todo={todo} onDelete={() => deleteTodo(todo.id)} />
      ))}
    </ul>
  </div>
</div>
)
}

const Deck = ({ deck, onDelete }: { deck: Decks; onDelete: () => void }) => {};
