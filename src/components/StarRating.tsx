import React from 'react';

interface StarRatingProps {
  stars: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({ stars, maxStars = 3, size = 'md' }: StarRatingProps) {
  const sizes = { sm: '16px', md: '24px', lg: '36px' };
  const fontSize = sizes[size];

  return (
    <div className="flex gap-1">
      {Array.from({ length: maxStars }).map((_, i) => (
        <span
          key={i}
          style={{
            fontSize,
            filter: i < stars ? 'drop-shadow(0 0 6px #feca57)' : 'grayscale(100%) opacity(0.3)',
            transition: 'all 0.3s ease',
          }}
        >
          ⭐
        </span>
      ))}
    </div>
  );
}
