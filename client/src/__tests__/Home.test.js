// __tests__/App.test.js

import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../pages/Home';

// Aggiungi altri test qui per verificare il comportamento dei componenti, ad esempio:

test('renders footer component', () => {
  render(<Home />);
  const footerElement = screen.getByTestId('footer');
  expect(footerElement).toBeInTheDocument();
});

// E così via, aggiungi i test necessari per verificare il comportamento dei tuoi componenti React.
