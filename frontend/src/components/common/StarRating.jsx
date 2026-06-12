import { useState } from 'react';
import { FiStar } from 'react-icons/fi';

const StarRating = ({
  rating = 0,
  maxRating = 5,
  size = 'text-lg',
  interactive = false,
  onChange,
  showValue = false
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  const getRating = () => {
    if (interactive) {
      return hoverRating || rating;
    }
    return rating;
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isActive = starValue <= getRating();

        return (
          <button
            key={index}
            type="button"
            className={`focus:outline-none ${
              interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'
            }`}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => handleClick(starValue)}
            disabled={!interactive}
          >
            <FiStar
              className={`${size} ${
                isActive ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              }`}
            />
          </button>
        );
      })}

      {showValue && (
        <span className="ml-2 text-sm text-gray-600">
          {rating.toFixed(1)} out of {maxRating}
        </span>
      )}
    </div>
  );
};

export default StarRating;
