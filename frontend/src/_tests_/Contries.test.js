import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Countries from '../components/Countries';
import { rest } from 'msw';
import { setupServer } from 'msw/node';


// Mock server to intercept the API call
const server = setupServer(
    rest.get('https://restcountries.com/v3.1/all', (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([{ name: { common: 'Country1' } }, { name: { common: 'Country2' } }])
      );
    }),
    rest.get('https://restcountries.com/v3.1/region/:region', (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([{ name: { common: 'Country3' } }, { name: { common: 'Country4' } }])
      );
    })
  );
  
  // Enable API mocking before tests
  beforeAll(() => server.listen());
  // Reset any runtime request handlers we may add during the tests
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());
  
  test('renders Countries component', async () => {
    render(<Countries favorites={[]} setFavorites={() => {}} />);
  
    // Check if the header is rendered
    expect(screen.getByText(/Countries Encyclopedia/i)).toBeInTheDocument();
  });
  
 
  