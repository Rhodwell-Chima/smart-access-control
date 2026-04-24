import { CircleHalfIcon, CheckIcon, MoonIcon, SunIcon } from "./ThemeIcons";

const themeOptions = [
  { value: "light", label: "Light", icon: <SunIcon /> },
  { value: "dark", label: "Dark", icon: <MoonIcon /> },
  { value: "auto", label: "Auto", icon: <CircleHalfIcon /> },
];

function getActiveIcon(theme) {
  if (theme === "light") return <SunIcon />;
  if (theme === "dark") return <MoonIcon />;
  return <CircleHalfIcon />;
}

export default function ThemeToggle({ theme, onSelectTheme }) {
  const activeIcon = getActiveIcon(theme);

  return (
    <div className="dropdown position-fixed bottom-0 end-0 mb-3 me-3 bd-mode-toggle">
      <button
        className="btn btn-bd-primary py-2 dropdown-toggle d-flex align-items-center"
        id="bd-theme"
        type="button"
        aria-expanded="false"
        data-bs-toggle="dropdown"
        aria-label="Toggle theme"
      >
        {activeIcon}
        <span className="visually-hidden" id="bd-theme-text">
          Toggle theme
        </span>
      </button>

      <ul
        className="dropdown-menu dropdown-menu-end shadow"
        aria-labelledby="bd-theme-text"
      >
        {themeOptions.map((opt) => (
          <li key={opt.value}>
            <button
              type="button"
              className={`dropdown-item d-flex align-items-center${
                theme === opt.value ? " active" : ""
              }`}
              onClick={() => onSelectTheme(opt.value)}
              aria-pressed={theme === opt.value}
            >
              {opt.icon}
              {opt.label}
              {theme === opt.value && <CheckIcon />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
