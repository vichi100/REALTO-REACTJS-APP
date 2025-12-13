import * as AppConstant from '../AppConstant';

describe('AppConstant.js', () => {
    it('should export defined constants', () => {
        expect(AppConstant.EMPLOYEE_ROLE).toBeDefined();
        expect(AppConstant.EMPLOYEE_ROLE_DELETE).toBeDefined();
        expect(AppConstant.RENT).toBe('Rent');
        expect(AppConstant.SELL).toBe('Sell');
        expect(AppConstant.BUY).toBe('Buy');
        expect(AppConstant.RESIDENTIAL).toBe('Residential');
        expect(AppConstant.COMMERCIAL).toBe('Commercial');
        expect(AppConstant.PROPERTY).toBe('Property');
        expect(AppConstant.CUSTOMER).toBe('Customer');
        expect(AppConstant.CONTACT).toBe('Contact');
        expect(AppConstant.REMINDER).toBe('Reminder');
        expect(AppConstant.MEETING).toBe('Meeting');
    });

    it('should have correct BHK mapping', () => {
        expect(AppConstant.BHK).toEqual({
            "1": "1 BHK",
            "2": "2 BHK",
            "3": "3 BHK",
            "4": "4 BHK",
            "5": "4+ BHK",
        });
    });

    it('should have correct PROPERTY_TYPE mapping', () => {
        expect(AppConstant.PROPERTY_TYPE).toEqual({
            "Residential": "Residential",
            "Commercial": "Commercial"
        });
    });

    it('should have correct PROPERTY_FOR mapping', () => {
        expect(AppConstant.PROPERTY_FOR).toEqual({
            "Rent": "Rent",
            "Sell": "Sell"
        });
    });

    it('should have correct TENANTS mapping', () => {
        expect(AppConstant.TENANTS).toEqual({
            "Bachelor": "Bachelor",
            "Family": "Family",
            "Working Bachelor": "Working Bachelor"
        });
    });

    it('should have correct FURNISHING mapping', () => {
        expect(AppConstant.FURNISHING).toEqual({
            "Full": "Full",
            "Semi Furnished": "Semi Furnished",
            "Unfurnished": "Unfurnished"
        });
    });

    it('should have correct PARKING mapping', () => {
        expect(AppConstant.PARKING).toEqual({
            "Bike": "Bike",
            "Car": "Car",
            "Both": "Both",
            "None": "None"
        });
    });

    it('should have correct HOUSE_TYPE mapping', () => {
        expect(AppConstant.HOUSE_TYPE).toEqual({
            "Apartment": "Apartment",
            "Independent House": "Independent House",
            "Villa": "Villa"
        });
    });

    it('should have correct USER_STATUS mapping', () => {
        expect(AppConstant.USER_STATUS).toEqual({
            "Active": "Active",
            "Inactive": "Inactive",
            "suspend": "suspend"
        });
    });

    it('should export array options', () => {
        expect(Array.isArray(AppConstant.COMMERCIAL_PROPERTY_TYPE_OPTION)).toBe(true);
        expect(Array.isArray(AppConstant.COMMERCIAL_PROPERTY_BUILDING_TYPE_OPTION)).toBe(true);
        expect(Array.isArray(AppConstant.COMMERCIAL_PROPERTY_IDEAL_FOR_OPTION)).toBe(true);
        expect(Array.isArray(AppConstant.COMMERCIAL_PARKING_OPTION)).toBe(true);
        expect(Array.isArray(AppConstant.PROPERTY_AGE_OPTION)).toBe(true);
        expect(Array.isArray(AppConstant.POWER_BACKUP_OPTION)).toBe(true);
        expect(Array.isArray(AppConstant.NEGOTIABLE_OPTION)).toBe(true);
        expect(Array.isArray(AppConstant.PROPERTY_TYPE_OPTION)).toBe(true);
        expect(Array.isArray(AppConstant.CUSTOMER_PROPERTY_FOR_OPTION)).toBe(true);
        expect(Array.isArray(AppConstant.PROPERTY_PREFERRED_TENANTS_OPTION)).toBe(true);
        expect(Array.isArray(AppConstant.CUSTOMER_PREFERRED_TENANTS_OPTION)).toBe(true);
        expect(Array.isArray(AppConstant.BHK_OPTION)).toBe(true);
        expect(Array.isArray(AppConstant.HOUSE_TYPE_OPTION)).toBe(true);
        expect(Array.isArray(AppConstant.FURNISHING_STATUS_OPTION)).toBe(true);
        expect(Array.isArray(AppConstant.PARKING_OPTION)).toBe(true);
        expect(Array.isArray(AppConstant.LIFT_AVAILBLE_OPTION)).toBe(true);
        expect(Array.isArray(AppConstant.PARKING_REQUIRED_OPTION)).toBe(true);
        expect(Array.isArray(AppConstant.REMINDER_FOR_OPTION)).toBe(true);
        expect(Array.isArray(AppConstant.AM_PM_OPTION)).toBe(true);
        expect(Array.isArray(AppConstant.DEAL_WIN_OPTION)).toBe(true);
    });
});
