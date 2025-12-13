import { routesMap } from '../routesMap';

describe('routesMap.js', () => {
    it('should export routesMap object', () => {
        expect(routesMap).toBeDefined();
        expect(typeof routesMap).toBe('object');
    });

    it('should contain expected routes', () => {
        expect(routesMap.Login).toBe("/profile/Login");
        expect(routesMap.GlobalSearch).toBe("/search");
        expect(routesMap.Listing).toBe("/listing");
        expect(routesMap.Contacts).toBe("/contacts");
        expect(routesMap.Notifications).toBe("/notifications");
        expect(routesMap.Profile).toBe("/profile");

        // Check a few others
        expect(routesMap.ManageEmployee).toBe("/profile/ManageEmployee");
        expect(routesMap.GlobalResidentialPropertySearchResult).toBe("/search/GlobalResidentialPropertySearchResult");
    });
});
