import Game from "./screens/Game";

export default function App() {
  if (import.meta.env.DEV) {
    return (
      <div style={{ width: 1024, height: 600, outline: "1px solid #7fa391", overflow: "hidden" }}>
        <Game />
      </div>
    );
  }
  return <Game />;
}