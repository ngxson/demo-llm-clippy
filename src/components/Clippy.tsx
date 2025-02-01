import { useEffect, useRef, useState } from 'react';
import clippyData from '../assets/clippy-data.json';
import clippyImage from '../assets/clippy-image.png';

const width = clippyData.framesize[0];
const height = clippyData.framesize[1];

export type Anim = keyof typeof clippyData['animations'];
export interface Frame {
  i: number;
  x: number;
  y: number;
};

export function Clippy({ anim }: { anim?: Anim }) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [frame, setFrame] = useState<Frame>({ i: 0, x: 0, y: 0 });

  useEffect(() => {
    const image = new Image();
    image.src = clippyImage;
    image.onload = () => {
      setImg(image);
    };
  }, []);

  useEffect(() => {
    if (!anim) {
      setFrame({ i: 0, x: 0, y: 0 });
      return;
    }

    const interval = setInterval(() => {
      const frames = clippyData.animations[anim].frames;
      setFrame((frame) => {
        const i = (frame.i + 1) % frames.length;
        const image = frames[i]?.images?.[0] ?? [0, 0];
        return { i, x: image[0], y: image[1] };
      });
    }, 80);

    return () => clearInterval(interval);
  }, [anim]);

  const { x, y } = frame;

  if (!img) return null;

  return (
    <div>
      {img && <ClippyFrame x={x} y={y} img={img} key={`${x}-${y}`} />}
    </div>
  );
}

function ClippyFrame({ x, y, img }: { x: number; y: number, img: HTMLImageElement }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(img, -x, -y);
      }
    }
  }, [canvasRef]);

  return <canvas ref={canvasRef} width={width} height={height}></canvas>;
}
