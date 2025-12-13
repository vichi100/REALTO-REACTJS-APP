import './setupTests';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AccordionListItem from '../AccordionListItem';

describe('AccordionListItem Component', () => {
    test('renders title and hidden content by default', () => {
        render(
            <AccordionListItem title="My Accordion">
                <div>Hidden Content</div>
            </AccordionListItem>
        );

        expect(screen.getByText('My Accordion')).toBeInTheDocument();
        // The content is in the DOM but hidden via max-height: 0
        const content = screen.getByText('Hidden Content');
        expect(content).toBeInTheDocument();

        // Check parent div style for max-height: 0px
        const contentWrapper = content.parentElement.parentElement;
        expect(contentWrapper).toHaveStyle('max-height: 0px');
    });

    test('toggles content on click', () => {
        render(
            <AccordionListItem title="My Accordion">
                <div>Hidden Content</div>
            </AccordionListItem>
        );

        const header = screen.getByText('My Accordion').parentElement;
        fireEvent.click(header);

        // After click, max-height should not be 0px. 
        // Note: scrollHeight is 0 in jsdom, so it might be 0px still unless we mock scrollHeight.
        // But we can check if the state changed by checking the arrow rotation class.

        const arrowContainer = header.lastChild;
        expect(arrowContainer).toHaveClass('rotate-180');

        fireEvent.click(header);
        expect(arrowContainer).toHaveClass('rotate-0');
    });

    test('respects open prop', () => {
        render(
            <AccordionListItem title="My Accordion" open={true}>
                <div>Visible Content</div>
            </AccordionListItem>
        );

        const header = screen.getByText('My Accordion').parentElement;
        const arrowContainer = header.lastChild;
        expect(arrowContainer).toHaveClass('rotate-180');
    });
});
