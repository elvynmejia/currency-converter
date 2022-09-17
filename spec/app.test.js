const { expect } = require('chai');

describe('currency conversion service', () => {
    context('/health', () => {
        it('check service health', async () => {
            const response = await global.request.get('/health');
            expect(response.status).to.equal(200);
            expect(response.text).to.eq('App running Ok!');
        });
    });
});
