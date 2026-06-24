import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app header', async () => {
  render(<App />);
  expect(await screen.findByText(/data from django/i)).toBeInTheDocument();
});