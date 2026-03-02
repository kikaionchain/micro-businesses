import { registerRoot, Composition } from 'remotion';
import { ForgeReveal } from './ForgeReveal';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="ForgeReveal"
        component={ForgeReveal}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};

registerRoot(RemotionRoot);
