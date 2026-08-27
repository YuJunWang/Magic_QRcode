import { Instance } from '@react-three/drei';

export interface VoxelData {
  x: number;
  y: number;
  z: number;
  color: string;
  height?: number;
}

interface TreeVoxelProps extends VoxelData {
  viewMode: '2d' | '3d';
}

export function TreeVoxel({ x, y, z, color, height = 0.08 }: TreeVoxelProps) {
  // Flat axis-aligned slab: always rotation [0, 0, 0], scale [1, height, 1]
  // This guarantees 100% gapless QR alignment in 2D top-down view,
  // and creates the crisp papercraft/voxel tiered tree in 3D isometric view.
  return (
    <Instance
      position={[x, y, z]}
      scale={[1, height, 1]}
      rotation={[0, 0, 0]}
      color={color}
    />
  );
}
