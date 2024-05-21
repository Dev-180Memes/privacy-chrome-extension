const { blockTrackersHandler, dntHeaderHandler } = require('../background/background');

describe('Background Script Tests', () => {
  test('Should block trackers', () => {
    const details = { url: 'https://www.trackingdomain.com/ad' };
    const result = blockTrackersHandler(details);
    expect(result.cancel).toBe(true);
  });

  test('Should not block non-trackers', () => {
    const details = { url: 'https://www.example.com' };
    const result = blockTrackersHandler(details);
    expect(result.cancel).toBe(false);
  });

  test('Should add DNT header', () => {
    const details = { requestHeaders: [] };
    const result = dntHeaderHandler(details);
    const dntHeader = result.requestHeaders.find(header => header.name === 'DNT');
    expect(dntHeader.value).toBe('1');
  });
});
