import * as Constant from '../Constant';

describe('Constant.js', () => {
    it('should export app constants', () => {
        expect(Constant.APP_NAME).toBe("Realto");
        expect(Constant.APP_VERSION).toBe("1.0.0");
        expect(Constant.APP_BUILD).toBe("1");
        // These depend on env vars, so we just check they are exported (even if undefined)
        expect(Constant).toHaveProperty('EMAIL_PDF_SERVER');
        expect(Constant).toHaveProperty('WEB_APP_URL');
        expect(Constant).toHaveProperty('SERVER_URL');
        expect(Constant).toHaveProperty('GOOGLE_PLACES_API_KEY');
    });

    it('should have correct date formats', () => {
        expect(Constant.APP_BUILD_TIMESTAMP_LONG_FORMAT).toBe("YYYY-MM-DD HH:mm:ss");
        expect(Constant.APP_BUILD_TIMESTAMP_SHORT_FORMAT).toBe("YYYY-MM-DD");
        expect(Constant.APP_BUILD_TIMESTAMP_TIME_FORMAT).toBe("HH:mm:ss");
        expect(Constant.APP_BUILD_TIMESTAMP_DATE_FORMAT).toBe("YYYY-MM-DD");
    });
});
