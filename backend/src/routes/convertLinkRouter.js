const express = require("express");
const router = express.Router();
const { convertLink } = require("../controllers/convertLinkController");
const { getStatus } = require("../controllers/statusController");
const logger = require("../helpers/recordLogs");

// Rota para criar uma nova conversão
// Route to create a new conversion
router.post("/link-convert", async (req, res) => {
  try {
    console.log("Starting conversion...");
    logger.info("Starting conversion...");

    console.log("Data Received: ", req.body);
    logger.info("Data Received: ", req.body);

    await convertLink(req, res);
  } catch (error) {
    logger.error("Error in /convert route:", error);
    res
      .status(500)
      .send({ error: "An error occurred while processing your request." });
  }
});

// Rota para atualizar o status de uma conversão
// Route to update the status of a conversion
/*
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
*/

// Rota para obter o estado de uma conversão
// Route to get the status of a conversion
router.get("/status/:requestId", async (req, res) => {
  try {
    logger.info(
      `Received request to get status for ID: ${req.params.requestId}`
    );
    await getStatus(req, res);
  } catch (error) {
    logger.error("Error in /status/:requestId route:", error);
    res
      .status(500)
      .send({ error: "An error occurred while processing your request." });
  }
});

module.exports = router;
