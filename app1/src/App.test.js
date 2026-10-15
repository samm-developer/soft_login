import { render, screen } from '@testing-library/react';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import App from './App';

jest.mock('@azure/msal-react', () => ({
  useMsal: jest.fn(),
  useIsAuthenticated: jest.fn(),
}));

test('shows the Microsoft sign-in button when signed out', () => {
  useMsal.mockReturnValue({ instance: {}, accounts: [], inProgress: 'none' });
  useIsAuthenticated.mockReturnValue(false);
  render(<App />);
  expect(
    screen.getByRole('button', { name: /sign in with microsoft/i }),
  ).toBeEnabled();
});
