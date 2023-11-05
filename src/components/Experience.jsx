import { Box, MeshWobbleMaterial } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import { useControls } from "leva";
import { useEffect, useMemo, useRef, useState } from "react";
import { pluginFile } from "./FileLevaInput";

import * as THREE from "three";

const ROTATION_SPEED = 1;

const readFile = (file, setReadFileData) => {
  const textureLoder = new THREE.TextureLoader();
  const fileReader = new FileReader();
  fileReader.onloadend = (e) => {
    setReadFileData(textureLoder.load(e.target.result));
  };
  fileReader.readAsDataURL(file);
};

const Cube = ({ color, ...props }) => {
  const cube = useRef();
  const [textureFile, setTextureFile] = useState(null);
  const onFileChange = setTextureFile;
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    if (textureFile) {
      readFile(textureFile, setImageData);
    }
  }, [textureFile]);

  useEffect(() => {
    if (imageData) {
      cube.current.material.needsUpdate = true;
    }
  }, [imageData]);

  const {
    color: selectedColor,
    rotationSpeed,
    rotation,
    wobble,
    move,
  } = useControls({
    color: color,
    rotation: false,
    rotationSpeed: {
      value: ROTATION_SPEED,
      min: ROTATION_SPEED,
      max: 5,
      step: 1,
      render: (get) => get("rotation"),
    },
    File: pluginFile({ onChange: onFileChange }),
    move: false,
    wobble: false,
  });

  const {
    x: sizex,
    y: sizey,
    z: sizez,
  } = useControls("Size", {
    x: {
      value: 1,
      min: 1,
      max: 5,
      step: 1,
    },
    y: {
      value: 1,
      min: 1,
      max: 5,
      step: 1,
    },
    z: {
      value: 1,
      min: 1,
      max: 5,
      step: 1,
    },
  });

  useFrame((state, delta) => {
    if (rotation) {
      cube.current.rotation.y += delta * rotationSpeed;
      cube.current.rotation.x += delta * rotationSpeed;
      cube.current.rotation.z += delta * rotationSpeed;
    }

    if (move) {
      cube.current.position.x = Math.sin(state.clock.getElapsedTime());
      cube.current.position.y = Math.sin(state.clock.getElapsedTime());
      cube.current.position.z = Math.sin(state.clock.getElapsedTime());
    }
  });

  return (
    <>
      {wobble ? <ambientLight intensity={5} /> : null}
      <Box {...props} ref={cube} args={[sizex, sizey, sizez]}>
        {wobble ? (
          <MeshWobbleMaterial
            color={selectedColor}
            toneMapped={false}
            map={imageData ? imageData : null}
          />
        ) : (
          <meshBasicMaterial
            color={selectedColor}
            toneMapped={false}
            map={imageData ? imageData : null}
          />
        )}
      </Box>
    </>
  );
};

export function Experience() {
  return <Cube color="#ffffff" />;
}
