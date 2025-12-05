import React from "react";

interface StarRatingProps {
  rating: number;
  setRating?: (r: number) => void;
  readOnly?: boolean;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, setRating, readOnly = false, size = 18 }) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-1">
      {stars.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => !readOnly && setRating && setRating(s)}
          className={`text-xl leading-none ${s <= rating ? "text-yellow-400" : "text-gray-300"}`}
          aria-label={`${s} star`}
          style={{ fontSize: size }}
        >
          ★
        </button>
      ))}
      {!readOnly && <span className="ml-2 text-sm text-gray-600">{rating}/5</span>}
    </div>
  );
};

export default StarRating;
