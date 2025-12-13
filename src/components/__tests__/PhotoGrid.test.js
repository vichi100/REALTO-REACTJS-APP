import './setupTests';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import PhotoGrid from '../PhotoGrid';

describe('PhotoGrid Component', () => {
    const source = [
        'img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg', 'img6.jpg'
    ];

    test('renders images', () => {
        const { container } = render(<PhotoGrid source={source} />);
        const images = container.querySelectorAll('img');
        // 5 images shown (last one is background image in div for +N)
        // Actually logic:
        // source length > 5.
        // firstViewImages: index 0, 1. (2 images)
        // secondViewImages: index 2, 3, 4. (3 images)
        // Total 5 items displayed.
        // Last item (index 4 of secondViewImages, which is index 4 of source) -> +N overlay?
        // Wait, logic:
        // index 0 -> first
        // index 1 -> first (if firstItemCount 2)
        // index 2,3,4 -> second

        // The last item in secondViewImages (index 2 of secondViewImages) checks:
        // index === secondViewImages.length - 1 (which is 2)
        // AND source.length > 5 (true)
        // So it renders div with background image and +N text.

        // So we expect 4 img tags and 1 div with background.
        expect(images.length).toBe(4);
    });

    test('renders +N overlay', () => {
        const { getByText } = render(<PhotoGrid source={source} />);
        // 6 images total, 5 shown. +1 remaining.
        expect(getByText('+1')).toBeInTheDocument();
    });

    test('handles image press', () => {
        const onPressImageMock = jest.fn();
        const { container } = render(<PhotoGrid source={source} onPressImage={onPressImageMock} />);

        const images = container.querySelectorAll('img');
        fireEvent.click(images[0]);
        expect(onPressImageMock).toHaveBeenCalledWith('img1.jpg');
    });
});
