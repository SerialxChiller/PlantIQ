import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/AppContext';

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
  return (
    <button
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--panel)] text-[var(--text2)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text)] ${
        compact ? 'h-8 w-8' : 'h-8 gap-1.5 px-2.5 text-[13px]'
      }`}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 text-amber-400" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      {!compact && <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>}
    </button>
  );
}
