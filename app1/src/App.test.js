import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import App from './App';

jest.mock('@azure/msal-react', () => ({
  useMsal: jest.fn(),
  useIsAuthenticated: jest.fn(),
}));

beforeEach(() => {
  useMsal.mockReturnValue({ instance: {}, accounts: [], inProgress: 'none' });
  useIsAuthenticated.mockReturnValue(false);
});

test('shows the Microsoft sign-in button when signed out', () => {
  render(<App />);
  expect(
    screen.getByRole('button', { name: /sign in with microsoft/i }),
  ).toBeEnabled();
});

test('generates random tokens without signing in and opens App 2 with them', () => {
  const open = jest.spyOn(window, 'open').mockImplementation(() => null);
  render(<App />);
  const openButton = screen.getByRole('button', { name: /open in app 2/i });
  expect(openButton).toBeDisabled();

  userEvent.click(screen.getByRole('button', { name: /generate id token/i }));
  userEvent.click(screen.getByRole('button', { name: /generate access token/i }));

  const idToken = screen.getByLabelText('ID token').value;
  const accessToken = screen.getByLabelText('Access token').value;
  expect(idToken).toMatch(/^[\w-]{43}$/);
  expect(accessToken).toMatch(/^[\w-]{43}$/);
  expect(idToken).not.toBe(accessToken);

  userEvent.click(openButton);
  const url = new URL(open.mock.calls[0][0]);
  const params = new URLSearchParams(url.hash.slice(1));
  expect(params.get('id_token')).toBe(idToken);
  expect(params.get('access_token')).toBe(accessToken);
});
