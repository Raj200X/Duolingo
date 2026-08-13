import React from "react";

export function LearnIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 4L4 14v14h24V14L16 4z" fill="#1CB0F6" />
      <path d="M16 4L4 14v14h24V14L16 4z" stroke="#1899D6" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M12 28V18h8v10" fill="#FFFFFF" stroke="#1899D6" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

export function LeaderboardIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 3L5 7v10c0 7 11 12 11 12s11-5 11-12V7L16 3z" fill="#FFC800" />
      <path d="M16 3v26c0 0 11-5 11-12V7L16 3z" fill="#FF9600" />
      <path d="M16 3L5 7v10c0 7 11 12 11 12s11-5 11-12V7L16 3z" stroke="#D37D00" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

export function QuestsIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="14" width="22" height="14" rx="2" fill="#CE82FF" stroke="#A568CC" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M5 14C5 8 10 6 16 6s11 2 11 8" fill="#CE82FF" stroke="#A568CC" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="13" y="16" width="6" height="8" rx="1" fill="#FFC800" stroke="#D37D00" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="16" cy="19" r="1.5" fill="#D37D00" />
    </svg>
  );
}

export function ShopIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="16" width="20" height="12" fill="#FFF" stroke="#E5E5E5" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M4 8l2 8h20l2-8H4z" fill="#FF4B4B" stroke="#D33F3F" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M10 8l1 8M16 8v8M22 8l-1 8" stroke="#D33F3F" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="12" y="20" width="8" height="8" fill="#1CB0F6" />
    </svg>
  );
}

export function ProfileIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="#E5E5E5" stroke="#AFAFAF" strokeWidth="2.5" />
      <circle cx="16" cy="12" r="5" fill="#AFAFAF" />
      <path d="M8 26c1.5-5 5-7 8-7s6.5 2 8 7" fill="#AFAFAF" />
    </svg>
  );
}

export function MoreIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="#FFF" stroke="#E5E5E5" strokeWidth="2.5" />
      <circle cx="10" cy="16" r="2.5" fill="#1CB0F6" />
      <circle cx="16" cy="16" r="2.5" fill="#FFC800" />
      <circle cx="22" cy="16" r="2.5" fill="#FF4B4B" />
    </svg>
  );
}

export function CharactersIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 26 L12 8 L18 8 L23 26" stroke="#1CB0F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 19 L20.5 19" stroke="#1CB0F6" strokeWidth="3" strokeLinecap="round" />
      <path d="M21 21 C21 21 22.5 15 25 15 C27.5 15 28 17 28 19 C28 23 23 27 23 27" stroke="#1899D6" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="21" cy="21" r="3" fill="#FFF" stroke="#1899D6" strokeWidth="2.5" />
    </svg>
  );
}
