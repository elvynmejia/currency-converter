const { expect } = require('chai');

const {
    apiId,
    apiKey,
} = require('../app/constants');

describe('currency conversion service', () => {
    context.skip('/health', () => {
        it('check service health', async () => {
            const response = await global.request.get('/health');
            expect(response.status).to.equal(200);
            expect(response.text).to.eq('App running Ok!');
        });
    });

    describe('authorization', () => {
        context('returns an error when making unathorized api calls', () => {
            it('missing expected authorization', async () => {
                const response = await global.request
                    .post('/api/v1/conversions')
                    .send({
                        from: 'BTC',
                        to: 'USD',
                        amount: '999.20',
                    });
                expect(response.status).to.equal(401);
                expect(response.body).to.deep.eq({ errors: [], message: 'Unauthorized' })
            });

            it('using wrong authorization', async () => {
                const response = await global.request
                    .post('/api/v1/conversions')
                    .auth('wrong', 'wrong')
                    .send({
                        from: 'BTC',
                        to: 'USD',
                        amount: '999.20',
                    });
                expect(response.status).to.equal(401);
                expect(response.body).to.deep.eq({ errors: [], message: 'Unauthorized' })
            });
        });
    });

    describe('/api/v1/conversions', () => {
        context('success', () => {
            it('convert currency', async () => {
                const response = await global.request
                    .post('/api/v1/conversions')
                    .auth(apiId, apiKey)
                    .send({
                        from: 'BTC',
                        to: 'USD',
                        amount: '999.20',
                    });
                expect(response.status).to.equal(200);

                expect(
                    Object.keys(response.body),
                ).to.have.members([
                    'from',
                    'to',
                    'amount',
                    'exchangeRate',
                    'newAmout',
                    'toRate',
                    'fromRate',
                ]);

                Object.values(response.body).forEach((item) => {
                    expect(item).to.not.eq(null);
                });
            });
        });

        context('errors', () => {
            it('missing from in the request body', async () => {
                const response = await global.request
                    .post('/api/v1/conversions')
                    .auth(apiId, apiKey)
                    .send({
                        // from: 'BTC',
                        to: 'USD',
                        amount: '999.20',
                    });
                expect(response.status).to.equal(422);
                expect(response.body).to.deep.eq({
                    errors: [{ message: '"from" is required' }],
                    message: 'Unprocessable Entity',
                });
            });

            it('missing to in the request body', async () => {
                const response = await global.request
                    .post('/api/v1/conversions')
                    .auth(apiId, apiKey)
                    .send({
                        from: 'BTC',
                        // to: 'USD',
                        amount: '999.20',
                    });
                expect(response.status).to.equal(422);
                expect(response.body).to.deep.eq({
                    errors: [{ message: '"to" is required' }],
                    message: 'Unprocessable Entity',
                });
            });

            it('missing amount in the request body', async () => {
                const response = await global.request
                    .post('/api/v1/conversions')
                    .auth(apiId, apiKey)
                    .send({
                        from: 'BTC',
                        to: 'USD',
                        // amount: '999.20',
                    });
                expect(response.status).to.equal(422);
                expect(response.body).to.deep.eq({
                    errors: [{ message: '"amount" is required' }],
                    message: 'Unprocessable Entity',
                });
            });
        });
    });
});
