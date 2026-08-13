import React from 'react';
import ChameleonMascot from '@/components/ui/ChameleonMascot';

export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="mb-8 relative">
        <ChameleonMascot state="curious" size={160} />
      </div>
      <h1 className="text-3xl font-display font-bold text-main mb-4">
        {title} is Coming Soon!
      </h1>
      <p className="text-muted text-lg max-w-md">
        We're working hard in the lab to bring you new features. Check back later to see what our chameleon has been building!
      </p>
    </div>
  );
}
