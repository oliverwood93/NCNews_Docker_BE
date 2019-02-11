const { expect } = require('chai');
const { formatTime, formatComments, getArticleIdLookup } = require('../db/utils');

describe('#Seeding Functions', () => {
  describe('#formatTime', () => {
    it('converts from epoch time into ISO time', () => {
      const epochTime = Date.now();
      const expected = Date.now().toIsoString();
    });
  });
});
