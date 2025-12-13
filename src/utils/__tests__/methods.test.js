import {
    makeCall,
    numDifferentiation,
    dateFormat,
    addDays,
    formatIsoDateToCustomString,
    camalize,
    formatClientNameForDisplay,
    formatMobileNumber
} from '../methods';

describe('methods.js utils', () => {
    describe('makeCall', () => {
        it('should set window.location.href with tel protocol', () => {
            // Mock window.location
            const originalLocation = window.location;
            delete window.location;
            window.location = { href: '' };

            makeCall('9876543210');
            expect(window.location.href).toBe('tel://+919876543210');

            makeCall('+919876543210');
            expect(window.location.href).toBe('tel://+919876543210');

            // Restore window.location
            window.location = originalLocation;
        });
    });

    describe('numDifferentiation', () => {
        it('should format numbers correctly', () => {
            expect(numDifferentiation(15000000)).toBe('1.5 Cr');
            expect(numDifferentiation(150000)).toBe('1.5 Lac');
            expect(numDifferentiation(1500)).toBe('1.5 K');
            expect(numDifferentiation(500)).toBe(500);
            expect(numDifferentiation(-1500)).toBe('1.5 K'); // It uses Math.abs
        });
    });

    describe('dateFormat', () => {
        it('should format date string', () => {
            const dateStr = "Fri Dec 12 2025 15:30:45 GMT+0530";
            expect(dateFormat(dateStr)).toBe("Fri Dec 12 2025");
        });
    });

    describe('addDays', () => {
        it('should add days to date', () => {
            const date = new Date('2023-01-01T00:00:00Z');
            const newDate = addDays(date, 5);
            // Check if time increased by 5 days (5 * 24 * 60 * 60 * 1000 ms)
            expect(newDate.getTime() - date.getTime()).toBe(5 * 24 * 60 * 60 * 1000);
        });
    });

    describe('formatIsoDateToCustomString', () => {
        it('should format ISO date string', () => {
            const iso = '2023-01-01T00:00:00Z';
            const result = formatIsoDateToCustomString(iso);
            expect(result).not.toBe("Invalid Date");
            // Matches format like "Sun Jan 1 2023"
            expect(result).toMatch(/\w{3} \w{3} \d{1,2} \d{4}/);
        });

        it('should handle invalid date', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
            expect(formatIsoDateToCustomString('invalid')).toBe('Invalid Date');
            consoleSpy.mockRestore();
        });
    });

    describe('camalize', () => {
        it('should title case string', () => {
            expect(camalize('hello world')).toBe('Hello World');
            expect(camalize('HELLO WORLD')).toBe('Hello World');
            expect(camalize('')).toBe('');
        });
    });

    describe('formatClientNameForDisplay', () => {
        it('should format client name', () => {
            expect(formatClientNameForDisplay('John Doe')).toBe('John Doe');
            expect(formatClientNameForDisplay('John Doe Smith')).toBe('John Doe\nSmith');
            expect(formatClientNameForDisplay(123)).toBe(123);
        });
    });

    describe('formatMobileNumber', () => {
        it('should format mobile number', () => {
            expect(formatMobileNumber('9876543210')).toBe('+91 9876543210');
            expect(formatMobileNumber('+919876543210')).toBe('+91 9876543210');
            expect(formatMobileNumber('919876543210')).toBe('+91 9876543210');
            expect(formatMobileNumber('')).toBe('');
        });
    });
});
