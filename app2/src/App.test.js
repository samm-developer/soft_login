import { render, screen } from '@testing-library/react';
import App from './App';

afterEach(() => window.history.replaceState(null, '', '/'));

test('asks for tokens when none are passed', () => {
  render(<App />);
  expect(screen.getByText(/no tokens received/i)).toBeInTheDocument();
});

test('shows tokens passed in the URL fragment and clears them from the URL', () => {
  window.history.replaceState(
    null,
    '',
    `/#${new URLSearchParams({ id_token: 'id-abc', access_token: 'access-xyz' })}`,
  );

  render(<App />);

  expect(screen.getByLabelText('ID token')).toHaveValue('id-abc');
  expect(screen.getByLabelText('Access token')).toHaveValue('access-xyz');
  expect(window.location.hash).toBe('');
});
