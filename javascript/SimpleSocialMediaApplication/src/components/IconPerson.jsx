const IconPerson = ({ className = "w-6 h-6" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label="Person icon"
    xmlns="http://www.w3.org/2000/svg"
    tabIndex={0}
    role="img"
  >
    <circle cx="12" cy="7" r="4" strokeWidth={2} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
  </svg>
);

export default IconPerson;
