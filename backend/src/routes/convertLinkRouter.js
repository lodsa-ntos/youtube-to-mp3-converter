const express = require("express");

const {
  createConversion,
  updateConversionStatus,
  getConversionStatus,
} = require("../controllers/convertLinkController");

const logger = require("../helpers/recordLogs");

const router = express.Router();

// Rota para criar uma nova conversão
// Route to create a new conversion
router.post("/convert", async (req, res) => {
  try {
    logger.info("Received request to create a new conversion.");
    await createConversion(req, res);
  } catch (error) {
    logger.error("Error in /convert route:", error);
    res
      .status(500)
      .send({ error: "An error occurred while processing your request." });
  }
});

// Rota para atualizar o status de uma conversão
// Route to update the status of a conversion
router.put("/convert/:requestId", async (req, res) => {
  try {
    logger.info(
      `Received request to update status for ID: ${req.params.requestId}`
    );
    await updateConversionStatus(req, res);
  } catch (error) {
    logger.error("Error in /status/:requestId route:", error);
    res
      .status(500)
      .send({ error: "An error occurred while processing your request." });
  }
});

// Rota para obter o estado de uma conversão
// Route to get the status of a conversion
router.get("/status/:requestId", async (req, res) => {
  try {
    logger.info(
      `Received request to get status for ID: ${req.params.requestId}`
    );
    await getConversionStatus(req, res);
  } catch (error) {
    logger.error("Error in /status/:requestId route:", error);
    res
      .status(500)
      .send({ error: "An error occurred while processing your request." });
  }
});

module.exports = router;
