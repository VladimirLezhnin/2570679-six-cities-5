import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { createMemoryHistory } from 'history';
import { Route, Routes } from 'react-router-dom';
import HistoryRouter from './history-route';

const TestComponent = () => <div>Test Component</div>;

describe('HOC: HistoryRouter', () => {
  it('should render child components correctly', () => {
    const history = createMemoryHistory();
    history.push('/test-route');

    render(
      <HistoryRouter history={history}>
        <Routes>
          <Route path="/test-route" element={<TestComponent />} />
        </Routes>
      </HistoryRouter>
    );

    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });

  it('should update route when history changes', () => {
    const history = createMemoryHistory();
    history.push('/initial-route');

    const TestComponentInitial = () => <div>Initial Route</div>;
    const TestComponentUpdated = () => <div>Updated Route</div>;

    render(
      <HistoryRouter history={history}>
        <Routes>
          <Route path="/initial-route" element={<TestComponentInitial />} />
          <Route path="/updated-route" element={<TestComponentUpdated />} />
        </Routes>
      </HistoryRouter>
    );

    expect(screen.getByText('Initial Route')).toBeInTheDocument();

    history.push('/updated-route');

    render(
      <HistoryRouter history={history}>
        <Routes>
          <Route path="/initial-route" element={<TestComponentInitial />} />
          <Route path="/updated-route" element={<TestComponentUpdated />} />
        </Routes>
      </HistoryRouter>
    );

    expect(screen.getByText('Updated Route')).toBeInTheDocument();
  });
});
