import type React from 'react';

export const S = {
  title: { margin: '0 0 4px', fontSize: '18px', fontWeight: 700, fontFamily: "'Playfair Display', serif", color: 'var(--primary)' } as React.CSSProperties,
  subtitle: { margin: '0 0 20px', fontSize: '13px', color: 'var(--text-muted)' } as React.CSSProperties,
  label: { display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' } as React.CSSProperties,
  input: { width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '14px', color: 'var(--text)', background: 'var(--background)', outline: 'none', boxSizing: 'border-box', fontFamily: 'DM Sans, sans-serif', transition: 'border-color 0.15s' } as React.CSSProperties,
  inputSm: { width: '100%', padding: '7px 6px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', color: 'var(--text)', background: 'var(--background)', outline: 'none', boxSizing: 'border-box', fontFamily: 'DM Sans, sans-serif', textAlign: 'center' } as React.CSSProperties,
  textarea: { width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '14px', color: 'var(--text)', background: 'var(--background)', outline: 'none', boxSizing: 'border-box', fontFamily: 'DM Sans, sans-serif', resize: 'vertical', lineHeight: 1.6 } as React.CSSProperties,
  th: { padding: '10px 12px', background: 'rgba(26,58,92,0.05)', borderBottom: '2px solid var(--border)', color: 'var(--text-muted)', fontWeight: 700, fontSize: '11px', letterSpacing: '0.07em', textTransform: 'uppercase', textAlign: 'center' } as React.CSSProperties,
  tdLabel: { padding: '10px 12px', fontWeight: 700, fontSize: '13px', color: 'white', background: 'var(--primary)', textAlign: 'center', width: '48px', letterSpacing: '0.04em' } as React.CSSProperties,
  td: { padding: '6px 8px', borderBottom: '1px solid var(--border)' } as React.CSSProperties,
  sectionLabel: { margin: '0 0 14px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' } as React.CSSProperties,
  onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { (e.target as HTMLElement).style.borderColor = '#c9a84c'; },
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { (e.target as HTMLElement).style.borderColor = 'var(--border)'; },
};
