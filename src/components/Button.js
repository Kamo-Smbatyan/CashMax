import React from "react";
import PropTypes from "prop-types";

function Button({ title, onClick, isFullWidth, variant, minWidth }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 font-bold shadow-lg transition-all duration-300 ${
        isFullWidth ? "w-full" : "w-auto"
      } ${
        variant === "secondary"
          ? "text-white bg-gradient-to-r from-[#86309e] to-[#af50f6] rounded-full"
          : "bg-gradient-to-r from-secondaryGreen via-primaryGreen to-secondaryGreen text-black shadow-green-500/50 hover:shadow-green-400/50 hover:bg-green-400 rounded-lg"
      }`}
      style={{ minWidth: minWidth || "200px" }}  // Default minWidth if not provided
    >
      {title}
    </button>
  );
}

// Prop validation for better debugging
Button.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  isFullWidth: PropTypes.bool,
  minWidth: PropTypes.string,  // Allow passing minWidth as a prop
  variant: PropTypes.string,
};

export default Button;
