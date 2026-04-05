import { ShieldAlert, AlertTriangle, Clock, Lock } from "lucide-react";

const Index = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background px-4">
      {/* Scan line effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-scan absolute left-0 w-full h-32 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      </div>

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--muted-foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--muted-foreground)) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-2xl w-full text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl scale-150 animate-pulse-glow" />
            <div className="relative rounded-full border-2 border-primary/40 bg-card p-5">
              <ShieldAlert className="h-12 w-12 text-primary" />
            </div>
          </div>
        </div>

        {/* Domain */}
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 font-[family-name:var(--font-mono)] text-sm text-muted-foreground">
          <Lock className="h-3.5 w-3.5" />
          fluxcoreapp.vercel.app
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
          We'll Be Back{" "}
          <span className="text-primary">Tomorrow</span>
        </h1>

        {/* Message */}
        <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
          A <span className="text-accent font-semibold">data leak</span> was detected and neutralized before any hackers could exploit it. Our team is actively working on a full fix.
        </p>

        {/* Status cards */}
        <div className="grid sm:grid-cols-2 gap-4 text-left">
          <div className="rounded-lg border border-border bg-card p-5 space-y-2">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <AlertTriangle className="h-4 w-4" />
              Issue Detected
            </div>
            <p className="text-sm text-muted-foreground">
              Data leakage vulnerability was identified and contained before exploitation.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5 space-y-2">
            <div className="flex items-center gap-2 text-accent font-semibold text-sm">
              <Clock className="h-4 w-4" />
              ETA: Tomorrow
            </div>
            <p className="text-sm text-muted-foreground">
              Our engineers are deploying patches. The app will return once everything is secure.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-muted-foreground pt-4 font-[family-name:var(--font-mono)]">
          STATUS: <span className="text-accent">PATCHING IN PROGRESS</span> — All user data is safe.
        </p>
      </div>
    </div>
  );
};

export default Index;
