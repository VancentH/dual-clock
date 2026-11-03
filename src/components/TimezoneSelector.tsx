import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { allTimezones, formatTimezoneName } from '../utils/timezones';
import styles from './TimezoneSelector.module.css';

type Props = {
  value: string;
  onChange: (timeZone: string) => void;
  /** Which edge the dropdown lines up with, so it opens away from the screen edge */
  align: 'start' | 'end';
};

const searchText = (timeZone: string) => timeZone.toLowerCase().replace(/[_/]/g, ' ');

export function TimezoneSelector({ value, onChange, align }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const results = useMemo(() => {
    const tokens = query.toLowerCase().replace(/[_/]/g, ' ').split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return allTimezones;
    return allTimezones.filter((tz) => {
      const text = searchText(tz);
      return tokens.every((t) => text.includes(t));
    });
  }, [query]);

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  // Keep the highlighted option visible while navigating with the keyboard
  useEffect(() => {
    if (!open) return;
    const item = listRef.current?.children[active] as HTMLElement | undefined;
    item?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  const openDropdown = () => {
    setQuery('');
    setActive(Math.max(0, allTimezones.indexOf(value)));
    setOpen(true);
  };

  const select = (timeZone: string) => {
    onChange(timeZone);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[active]) select(results[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openDropdown())}
      >
        <span className={styles.value}>{formatTimezoneName(value)}</span>
        <span className={styles.caret} aria-hidden="true">▾</span>
      </button>

      {open && (
        <div className={`${styles.popover} ${align === 'end' ? styles.alignEnd : styles.alignStart}`} data-no-drag>
          <input
            className={styles.search}
            type="text"
            placeholder="Search time zones…"
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={results[active] ? `${listId}-${active}` : undefined}
          />
          <ul className={styles.list} id={listId} role="listbox" ref={listRef}>
            {results.map((tz, i) => (
              <li
                key={tz}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={tz === value}
                className={`${styles.option} ${i === active ? styles.active : ''} ${tz === value ? styles.selected : ''}`}
                onPointerMove={() => setActive(i)}
                onClick={() => select(tz)}
              >
                {formatTimezoneName(tz)}
              </li>
            ))}
            {results.length === 0 && <li className={styles.empty}>No matching time zones</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
