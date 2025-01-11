const { validateUrl } = require('../src/utils/validate-links');

describe('validateUrl', () => {
  //Test1_ValidateUrls
  test('should return true for valid YouTube URLs', () => { 
    const validUrls = [
      'https://www.youtube.com/watch?v=12345',
      'http://youtube.com/watch?v=12345',
      'https://youtu.be/12345',
    ];
    validUrls.forEach(url => {
      expect(validateUrl(url)).toBe(true);
    });
   });

  //Test2_ValidateUrls
  test('should return false for invalid URLs', () => { 
    const invalidUrls = [
      'https://example.com/watch?v=12345',
      'http://notyoutube.com/watch?v=12345',
      'randomstring',
      '',
    ];
    invalidUrls.forEach(url => {
      expect(validateUrl(url)).toBe(false);
    });
   });
});