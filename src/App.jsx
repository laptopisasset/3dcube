import { Canvas } from "@react-three/fiber";
import "./App.css";
import { Experience } from "./components/Experience";

function App() {
  return (
    <Canvas>
      <color attach="background" args={["black"]} />
      <Experience />
    </Canvas>
  );
}

export default App;
