"use client";

import React, { use } from "react";
import Link from "next/link";
import { Volume2, ArrowLeft } from "lucide-react";
import ChameleonMascot from "@/components/ui/ChameleonMascot";
import "./Guidebook.css";

const GUIDEBOOK_DATA: Record<string, any> = {
  "1": {
    title: "Unit 1",
    subtitle: "Basics: Intro to Spanish",
    bgColor: "#58CC02",
    phrases: [
      { es: "Hola", en: "Hello" },
      { es: "Adiós", en: "Goodbye" },
      { es: "Gracias", en: "Thank you" },
      { es: "El niño", en: "The boy" },
      { es: "La niña", en: "The girl" }
    ],
    tips: "In Spanish, all nouns are either masculine or feminine. Masculine nouns usually use 'el' (the) and end in '-o'. Feminine nouns usually use 'la' (the) and end in '-a'."
  },
  "2": {
    title: "Unit 2",
    subtitle: "Travel: Airport and hotel",
    bgColor: "#CE82FF",
    phrases: [
      { es: "El pasaporte, por favor", en: "The passport, please" },
      { es: "Un boleto", en: "A ticket" },
      { es: "¿Dónde está el hotel?", en: "Where is the hotel?" },
      { es: "Un taxi", en: "A taxi" }
    ],
    tips: "To ask where something is, use '¿Dónde está...?'. For example, '¿Dónde está el baño?' (Where is the bathroom?). Remember that questions in Spanish start with an upside-down question mark!"
  },
  "3": {
    title: "Unit 3",
    subtitle: "Food: Ordering at a restaurant",
    bgColor: "#FF9600",
    phrases: [
      { es: "La mesa", en: "The table" },
      { es: "El restaurante", en: "The restaurant" },
      { es: "Yo quiero pan", en: "I want bread" },
      { es: "Comer manzanas", en: "To eat apples" }
    ],
    tips: "To say you want something, use 'Yo quiero' (I want). 'Yo' means I, but it's often optional in Spanish because the verb 'quiero' already tells us who is wanting!"
  },
  "4": {
    title: "Unit 4",
    subtitle: "Hobbies: Sports and Music",
    bgColor: "#1CB0F6",
    phrases: [
      { es: "Jugar al fútbol", en: "To play soccer" },
      { es: "Yo escucho música", en: "I listen to music" },
      { es: "Tocar la guitarra", en: "To play the guitar" },
      { es: "El béisbol", en: "Baseball" }
    ],
    tips: "In English we use the word 'play' for both sports and instruments. In Spanish, use 'jugar' for sports (jugar al fútbol) and 'tocar' for instruments (tocar la guitarra)!"
  }
};

export default function GuidebookPage({ params }: { params: Promise<{ unitId: string }> }) {
  const unwrappedParams = use(params);
  const unitId = unwrappedParams.unitId;
  const data = GUIDEBOOK_DATA[unitId];

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-3xl font-display font-bold text-main mb-4">Guidebook Not Found</h1>
        <Link href="/learn" className="text-primary font-bold">Return Home</Link>
      </div>
    );
  }

  const playAudio = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    utterance.rate = 0.85; // Slightly slower for clarity
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="guidebook-page">
      <div className="guidebook-top-bar">
        <Link href="/learn" className="guidebook-back-btn">
          <ArrowLeft size={20} strokeWidth={2.5} /> Back
        </Link>
      </div>
      
      <div className="guidebook-header-row">
        <div className="guidebook-mascot-container">
          {/* We'll use our Chameleon mascot instead of Duo */}
          <div className="guidebook-mascot-circle">
            <ChameleonMascot state="idle" size={90} />
          </div>
        </div>
        <div className="guidebook-header-text">
          <h1 className="guidebook-title">{data.title} Guidebook</h1>
          <h2 className="guidebook-subtitle">Explore grammar tips and key phrases for this unit</h2>
        </div>
      </div>

      <hr className="guidebook-divider" />

      <div className="guidebook-content">
        <h3 className="guidebook-section-title">KEY PHRASES</h3>
        <div className="guidebook-list">
          {data.phrases.map((phrase: any, i: number) => (
            <div key={i} className="guidebook-bubble-container">
              <div 
                className="guidebook-bubble"
                onClick={() => playAudio(phrase.es)}
                title="Play pronunciation"
              >
                <div className="guidebook-bubble-icon">
                  <Volume2 size={24} strokeWidth={3} />
                </div>
                <div className="guidebook-phrase-wrapper">
                  <span className="guidebook-phrase">{phrase.es}</span>
                  <span className="guidebook-translation">{phrase.en}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h3 className="guidebook-section-title mt-8">GRAMMAR TIPS</h3>
        <div className="guidebook-bubble">
          <p className="guidebook-tip-text">{data.tips}</p>
        </div>
      </div>
    </div>
  );
}
