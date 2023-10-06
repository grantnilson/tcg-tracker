import React, { useEffect, useState } from "react";
import DeckList from "../../components/Deck/DeckList";

export default function Decks() {
  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      <DeckList />
    </div>
  );
}
