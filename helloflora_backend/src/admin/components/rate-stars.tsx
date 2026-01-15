import { Star, StarSolid } from "@medusajs/icons"

interface RateStarsProps {
  repeatCount: number;
  maxRate: number;
}

export const ReateStars: React.FC<RateStarsProps> = ({ repeatCount, maxRate }) => {
  
  const indicesArray: number[] = Array.from({ length: repeatCount }, (_, i) => i);
  const reverseArray: number[] = Array.from({ length: maxRate - repeatCount }, (_, i) => i);

  return (
    <div style={{ display: 'flex', gap: '5px' }}>
      
      {indicesArray.map((index) => (
        <StarSolid key={index} color="gold"/>
      ))}

       {reverseArray.map((index) => (
        <Star key={index} color="gold"/>
      ))}

    </div>
  );
};