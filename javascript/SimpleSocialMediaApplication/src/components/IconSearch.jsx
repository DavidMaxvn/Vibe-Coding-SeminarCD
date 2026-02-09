const IconSearch = ({ className = "w-6 h-6" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label="Search icon"
    xmlns="http://www.w3.org/2000/svg"
    tabIndex={0}
    role="img"
  >
    <circle cx="11" cy="11" r="8" strokeWidth={2} />
    <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth={2} />
  </svg>
);

export default IconSearch;
