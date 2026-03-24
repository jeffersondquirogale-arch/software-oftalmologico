import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { GlobalSearch } from '../components/GlobalSearch';

vi.mock('../db/database', () => ({
  db: {
    pacientes: { toArray: vi.fn().mockResolvedValue([]) },
    historiasClinicas: { toArray: vi.fn().mockResolvedValue([]) },
    citas: { toArray: vi.fn().mockResolvedValue([]) },
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('GlobalSearch', () => {
  it('renders when open', () => {
    render(
      <MemoryRouter>
        <GlobalSearch isOpen={true} onClose={vi.fn()} />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText('Buscar pacientes, historias, citas...')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <MemoryRouter>
        <GlobalSearch isOpen={false} onClose={vi.fn()} />
      </MemoryRouter>
    );
    expect(screen.queryByPlaceholderText('Buscar pacientes, historias, citas...')).not.toBeInTheDocument();
  });

  it('shows empty state hint text', () => {
    render(
      <MemoryRouter>
        <GlobalSearch isOpen={true} onClose={vi.fn()} />
      </MemoryRouter>
    );
    expect(screen.getByText('Escribe para buscar pacientes, historias y citas')).toBeInTheDocument();
  });

  it('accepts input', () => {
    render(
      <MemoryRouter>
        <GlobalSearch isOpen={true} onClose={vi.fn()} />
      </MemoryRouter>
    );
    const input = screen.getByPlaceholderText('Buscar pacientes, historias, citas...') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test' } });
    expect(input.value).toBe('test');
  });

  it('calls onClose when X button clicked', () => {
    const onClose = vi.fn();
    render(
      <MemoryRouter>
        <GlobalSearch isOpen={true} onClose={onClose} />
      </MemoryRouter>
    );
    const buttons = screen.getAllByRole('button');
    const lastBtn = buttons[buttons.length - 1];
    fireEvent.click(lastBtn);
    expect(onClose).toHaveBeenCalled();
  });
});
