import Link from "next/link";
import ChameleonMascot from "@/components/ui/ChameleonMascot";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="mb-8 opacity-80 grayscale">
        <ChameleonMascot state="sleepy" size={160} />
      </div>
      
      <h1 className="text-4xl font-display font-black text-main mb-4">
        Page Not Found
      </h1>
      
      <p className="text-body text-muted max-w-md mb-8">
        Oops! Looks like this page doesn't exist. The chameleon might have blended it into the background.
      </p>
      
      <Link href="/">
        <Button variant="primary" style={{ padding: "16px 32px", fontSize: "16px" }}>
          RETURN HOME
        </Button>
      </Link>
    </div>
  );
}
