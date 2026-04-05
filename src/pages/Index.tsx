import { useState, useEffect, useCallback, useRef } from "react";
import { ShieldAlert, AlertTriangle, Clock, Lock, Gamepad2 } from "lucide-react";
import fluxcoreLogo from "@/assets/fluxcore-logo.png";

/* ─── Snake Game ─── */
const CELL = 16;
const COLS = 20;
const ROWS = 14;
const WIDTH = COLS * CELL;
const HEIGHT = ROWS * CELL;

type Point = { x: number; y: number };

const randomFood = (snake: Point[]): Point => {
  let p: Point;
  do {
    p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (snake.some((s) => s.x === p.x && s.y === p.y));
  return p;
};

const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"idle" | "playing" | "over">("idle");
  const [score, setScore] = useState(0);

  const snakeRef = useRef<Point[]>([{ x: 10, y: 7 }]);
  const dirRef = useRef<Point>({ x: 1, y: 0 });
  const nextDirRef = useRef<Point>({ x: 1, y: 0 });
  const foodRef = useRef<Point>(randomFood(snakeRef.current));
  const tickRef = useRef<number>(0);

  const reset = useCallback(() => {
    snakeRef.current = [{ x: 10, y: 7 }];
    dirRef.current = { x: 1, y: 0 };
    nextDirRef.current = { x: 1, y: 0 };
    foodRef.current = randomFood(snakeRef.current);
    setScore(0);
    setGameState("playing");
  }, []);

  /* keyboard + touch */
  useEffect(() => {
    if (gameState !== "playing") return;
    const handle = (e: KeyboardEvent) => {
      const cur = dirRef.current;
      switch (e.key) {
        case "ArrowUp":
        case "w":
          if (cur.y === 0) nextDirRef.current = { x: 0, y: -1 };
          break;
        case "ArrowDown":
        case "s":
          if (cur.y === 0) nextDirRef.current = { x: 0, y: 1 };
          break;
        case "ArrowLeft":
        case "a":
          if (cur.x === 0) nextDirRef.current = { x: -1, y: 0 };
          break;
        case "ArrowRight":
        case "d":
          if (cur.x === 0) nextDirRef.current = { x: 1, y: 0 };
          break;
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [gameState]);

  /* game loop */
  useEffect(() => {
    if (gameState !== "playing") return;
    const interval = setInterval(() => {
      const snake = snakeRef.current;
      dirRef.current = nextDirRef.current;
      const head = {
        x: snake[0].x + dirRef.current.x,
        y: snake[0].y + dirRef.current.y,
      };
      // wall collision
      if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
        setGameState("over");
        return;
      }
      // self collision
      if (snake.some((s) => s.x === head.x && s.y === head.y)) {
        setGameState("over");
        return;
      }
      const newSnake = [head, ...snake];
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        foodRef.current = randomFood(newSnake);
        setScore((s) => s + 1);
      } else {
        newSnake.pop();
      }
      snakeRef.current = newSnake;
      tickRef.current++;
      draw();
    }, 110);
    return () => clearInterval(interval);
  }, [gameState]);

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    // bg
    ctx.fillStyle = "hsl(220 20% 8%)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    // grid dots
    ctx.fillStyle = "hsl(220 15% 14%)";
    for (let x = 0; x < COLS; x++)
      for (let y = 0; y < ROWS; y++)
        ctx.fillRect(x * CELL + CELL / 2 - 0.5, y * CELL + CELL / 2 - 0.5, 1, 1);
    // food
    ctx.fillStyle = "hsl(0 85% 60%)";
    ctx.beginPath();
    ctx.arc(
      foodRef.current.x * CELL + CELL / 2,
      foodRef.current.y * CELL + CELL / 2,
      CELL / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    // snake
    const snake = snakeRef.current;
    snake.forEach((s, i) => {
      const t = 1 - i / snake.length;
      ctx.fillStyle = `hsl(215 ${70 + t * 20}% ${45 + t * 25}%)`;
      ctx.beginPath();
      ctx.roundRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2, 3);
      ctx.fill();
    });
  }, []);

  /* initial draw */
  useEffect(() => {
    draw();
  }, [draw]);

  /* touch controls */
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    const cur = dirRef.current;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 20 && cur.x === 0) nextDirRef.current = { x: 1, y: 0 };
      if (dx < -20 && cur.x === 0) nextDirRef.current = { x: -1, y: 0 };
    } else {
      if (dy > 20 && cur.y === 0) nextDirRef.current = { x: 0, y: 1 };
      if (dy < -20 && cur.y === 0) nextDirRef.current = { x: 0, y: -1 };
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Gamepad2 className="h-4 w-4" />
        <span>Snake — Kill time while we patch things up</span>
      </div>
      <div className="relative rounded-lg border border-border overflow-hidden" style={{ width: WIDTH, height: HEIGHT }}>
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          className="block"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />
        {gameState !== "playing" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
            {gameState === "over" && (
              <p className="text-primary font-bold text-lg mb-1">Game Over — {score} pts</p>
            )}
            <button
              onClick={reset}
              className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              {gameState === "idle" ? "Play Snake" : "Play Again"}
            </button>
            <p className="text-xs text-muted-foreground mt-2">
              Arrow keys / WASD or swipe
            </p>
          </div>
        )}
      </div>
      {gameState === "playing" && (
        <p className="text-xs text-muted-foreground font-[family-name:var(--font-mono)]">
          SCORE: <span className="text-primary">{score}</span>
        </p>
      )}
    </div>
  );
};

/* ─── Main Page ─── */
const Index = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden bg-background px-4 py-12">
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
        {/* Logo */}
        <div className="flex justify-center">
          <img src={fluxcoreLogo} alt="FluxCore logo" className="h-28 w-28 drop-shadow-lg" />
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
        <p className="text-xs text-muted-foreground pt-2 font-[family-name:var(--font-mono)]">
          STATUS: <span className="text-accent">PATCHING IN PROGRESS</span> — All user data is safe.
        </p>

        {/* Mini Game */}
        <div className="pt-4">
          <SnakeGame />
        </div>
      </div>
    </div>
  );
};

export default Index;
