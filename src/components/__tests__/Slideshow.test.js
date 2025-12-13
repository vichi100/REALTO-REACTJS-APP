import './setupTests';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Slideshow from '../Slideshow';

describe('Slideshow Component', () => {
    const dataSource = [
        { url: 'img1.jpg', title: 'Title 1' },
        { url: 'img2.jpg', title: 'Title 2' }
    ];

    beforeAll(() => {
        // Mock scrollTo
        Element.prototype.scrollTo = jest.fn();
    });

    test('renders images and titles', () => {
        render(<Slideshow dataSource={dataSource} />);
        expect(screen.getByText('Title 1')).toBeInTheDocument();
        expect(screen.getByText('Title 2')).toBeInTheDocument();
        const images = screen.getAllByRole('img');
        expect(images.length).toBe(2);
    });

    test('navigates with arrows', () => {
        render(<Slideshow dataSource={dataSource} />);

        // Find arrows. They are in divs with specific classes or we can find by svg.
        // The code uses MdChevronLeft and MdChevronRight.
        // We can find by role button if they had it, but they are divs with onClick.
        // We can find by class or just query selector.

        // Left arrow
        const leftArrow = screen.getAllByRole('img', { hidden: true }).find(el => el.tagName === 'svg' && el.innerHTML.includes('ChevronLeft'))
            || document.querySelector('.absolute.left-\\[10px\\]');

        // Right arrow
        const rightArrow = document.querySelector('.absolute.right-\\[10px\\]');

        fireEvent.click(rightArrow);
        expect(Element.prototype.scrollTo).toHaveBeenCalled();

        fireEvent.click(leftArrow);
        expect(Element.prototype.scrollTo).toHaveBeenCalled();
    });

    test('navigates with indicators', () => {
        render(<Slideshow dataSource={dataSource} />);

        // Indicators are divs at bottom.
        // We can find them by checking the container.
        const indicators = document.querySelectorAll('.absolute.bottom-\\[5px\\] > div');
        expect(indicators.length).toBe(2);

        fireEvent.click(indicators[1]);
        expect(Element.prototype.scrollTo).toHaveBeenCalled();
    });

    test('handles image press', () => {
        const onPressMock = jest.fn();
        render(<Slideshow dataSource={dataSource} onPress={onPressMock} />);

        const images = screen.getAllByRole('img');
        // The click handler is on the parent div of the image
        fireEvent.click(images[0].closest('.cursor-pointer'));

        expect(onPressMock).toHaveBeenCalledWith({ image: dataSource[0], index: 0 });
    });
});
