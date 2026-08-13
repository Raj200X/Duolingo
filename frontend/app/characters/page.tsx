"use client";

import React from "react";
import "./Characters.css";

const SPANISH_CHARS = [
  { char: "A", sub: "a" }, { char: "B", sub: "be" }, { char: "C", sub: "ce" }, { char: "D", sub: "de" }, { char: "E", sub: "e" },
  { char: "F", sub: "efe" }, { char: "G", sub: "ge" }, { char: "H", sub: "hache" }, { char: "I", sub: "i" }, { char: "J", sub: "jota" },
  { char: "K", sub: "ka" }, { char: "L", sub: "ele" }, { char: "M", sub: "eme" }, { char: "N", sub: "ene" }, { char: "Ñ", sub: "eñe" },
  { char: "O", sub: "o" }, { char: "P", sub: "pe" }, { char: "Q", sub: "cu" }, { char: "R", sub: "erre" }, { char: "S", sub: "ese" },
  { char: "T", sub: "te" }, { char: "U", sub: "u" }, { char: "V", sub: "uve" }, { char: "W", sub: "uve doble" }, { char: "X", sub: "equis" },
  { char: "Y", sub: "i griega" }, { char: "Z", sub: "zeta" }, { char: "Á", sub: "á" }, { char: "É", sub: "é" }, { char: "Í", sub: "í" },
  { char: "Ó", sub: "ó" }, { char: "Ú", sub: "ú" }, { char: "¿", sub: "interrogación" }, { char: "¡", sub: "exclamación" }, null
];

export default function CharactersPage() {
  const playAudio = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel(); // stop any currently playing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="characters-page">
      <h1 className="characters-header">El Alfabeto</h1>
      <div className="characters-grid">
        {SPANISH_CHARS.map((item, idx) => {
          if (!item) {
            return <div key={`empty-${idx}`} className="character-card empty"></div>;
          }
          return (
            <div 
              key={item.char} 
              className="character-card"
              onClick={() => playAudio(item.sub)}
            >
              <span className="character-main">{item.char}</span>
              <span className="character-sub">{item.sub}</span>
              <div className="character-bar"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
