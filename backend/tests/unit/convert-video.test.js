//! Explanation of the tests
/**
 * Unit tests for the convertVideo function in the Convert Video Service.
 * 
 * These tests cover the following scenarios:
 * 
 * 1. Test1_MissingUrls: Ensures that the service returns a 400 status code 
 *    and an appropriate error message when the URL is missing from the request body.
 * 
 * 2. Test2_InvalidUrls: Ensures that the service returns a 400 status code 
 *    and an appropriate error message when the URL provided in the request body is invalid.
 * 
 * 3. Test3_successfulVideoConversion: Ensures that the service successfully converts 
 *    a valid video URL and returns a 200 status code along with a JSON object containing 
 *    the requestId and download URL.
 * 
 * Helper functions:
 * - mockRequest: Simulates a request object with optional data.
 * - mockResponse: Simulates a response object with mocked status and json methods.
 * 
 * Mocked global functions:
 * - generatedRequestId: Mocks the generation of a requestId.
 * - generatedDownloadUrl: Mocks the generation of a download URL.
 * 
 * Each test case verifies the expected behavior of the convertVideo function 
 * by checking the status code and JSON response returned by the function.
 */
//!
// Test1_MissingUrls + Test2_InvalidUrls
const { convertVideo } = require('../../src/services/converter-video');

// Helpers para simular os objetos de requisição e resposta
// Helpers to simulate request and response objects
const mockRequest = (data = {}) => ({
  body: data.body || {},
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Convert Video Service', () => {
  it('should return 400 if URL is missing', async () => {
    const req = mockRequest({ body: { url: '' } });
    const res = mockResponse();

    await convertVideo(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or missing video URL'});
  });

  it('should return 400 if URL is invalid', async () => {
    const req = mockRequest({ body: { url: 'invalid-url' } });
    const res = mockResponse();

    await convertVideo(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or missing video URL'});
  });
});

// Test3_successfulVideoConversion
//const { convertVideo } = require('../../src/services/converter-video');
//const { convertVideo } = require('../../src/services/converter-video');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const { validateUrl } = require("../../src/middlewares/validate-links");
const request = require('supertest');
const app = require('../../src/app');  // Caminho para o arquivo que exporta o app
const logger = require('../../src/helpers/record-logs');
const exp = require('constants');

jest.mock("ytdl-core");
jest.mock("fluent-ffmpeg");
jest.mock("fs");
jest.mock("../../src/middlewares/validate-links", () => ({
  validateUrl: jest.fn().mockReturnValue(true),
}));

describe('Convert Video Service', () => {
  it('should return 400 if URL is missing', async () => {
    const req = { body: { url: '' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await convertVideo(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or missing video URL' });
  });

  it('should return 400 if URL is invalid', async () => {
    const req = { body: { url: 'invalid-url' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await convertVideo(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or missing video URL' });
  });

  it('should successfully convert video and return download URL', async () => {
    const validUrl = "https://www.youtube.com/watch?v=validVideo";
    const quality = "1258";
    const expectedDownloadUrl = `/downloads/Sample_Video_128kbps.mp3`;

    jest.spyOn(logger, 'info');
    convertVideo(req, res);
    expect(logger.info).toHaveBeenCalledWith(`Request received to convert video: ${validUrl}`);

    // Mocking the video info and ffmpeg behavior
    ytdl.getInfo.mockResolvedValue({
      videoDetails: { title: 'Sample Video' },
    });

    ffmpeg.mockImplementation(() => ({
      audioBitrate: jest.fn().mockReturnThis(),
      save: jest.fn().mockImplementation((outputPath) => ({
        on: (event, callback) => {
          if (event === 'end') {
            callback(); // Simula o sucesso da conversão
          }
          if (event === 'error') {
            callback(new Error("Conversion failed"));
          }
        },
      })),
    }));

    // Mocking fs to simulate file existence and creation
    fs.existsSync.mockReturnValue(true);
    fs.mkdirSync.mockReturnValue(true);

    // Call the service via the actual API (integration test)
    const response = await request(app)
      .post('/convert')
      .send({ videoUrl: validUrl, quality });

    // Verificar se a resposta foi a esperada
    logger.info(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Conversion completed',
      downloadUrl: expectedDownloadUrl,
    });
  });
});
