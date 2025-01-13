import { render } from '@testing-library/react';
import SpinnerLoader from './spinner-loader';

describe('SpinnerLoader Component', () => {
  it('renders the spinner SVG correctly', () => {
    const { container } = render(<SpinnerLoader />);

    const circleElement = container.querySelector('circle');
    expect(circleElement).toBeInTheDocument();

    const circles = container.querySelectorAll('circle');
    expect(circles).toHaveLength(2);
  });
});
