const { validateUrl } = require('../../src/middlewares/validate-links');

describe('validateUrl', () => {
  //Test1_ValidatUrls
  test('should return true for valid YouTube URLs', () => { 
    const validUrls = [
      'https://www.youtube.com/watch?v=12345',
      'http://youtube.com/watch?v=12345',
      'https://youtu.be/12345',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    ];
    validUrls.forEach(url => {
      expect(validateUrl(url)).toBe(true);
    });
   });

  //Test2_InvalidUrls
  test('should return false for invalid URLs', () => { 
    const invalidUrls = [
      'https://example.com/watch?v=12345',
      'http://notyoutube.com/watch?v=12345',
      'randomstring',
      'https://www.google.com',
      '',
    ];
    invalidUrls.forEach(url => {
      expect(validateUrl(url)).toBe(false);
    });
   });

   //Test3_URLWithParameters
  test('should return true for valid YouTube URLs with parameters', () => {
    const validUrlsWithParams = [
      'https://www.youtube.com/watch?v=12345&list=PL12345',
      'https://www.youtube.com/watch?v=12345&t=10s',
      'https://www.youtube.com/watch?v=12345&feature=youtu.be',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley',
    ];
    validUrlsWithParams.forEach(url => {
      expect(validateUrl(url)).toBe(true);
    });
  });

  //Test4_URLWithout"https://"
  test('should return true for valid YouTube URLs without "https://"', () => {
    const validUrlsWithoutHttps = [
      'www.youtube.com/watch?v=dQw4w9WgXcQ',
      'www.youtube.com/watch?v=12345',
      'youtube.com/watch?v=12345',
      'youtu.be/12345',
    ];
    validUrlsWithoutHttps.forEach(url => {
      expect(validateUrl(url)).toBe(true);
    });
  });
});