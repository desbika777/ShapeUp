import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from '@/components/ui/pagination';

describe('Pagination', () => {
  it('renders window with ellipsis and navigates to page', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Pagination page={10} totalPages={20} onChange={onChange} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getAllByText('...').length).toBeGreaterThan(0);

    await user.click(screen.getByText('20'));
    expect(onChange).toHaveBeenCalledWith(20);
  });
});

