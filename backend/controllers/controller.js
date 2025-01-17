const axios = require("axios");

//dynamic fetch handler
const handleFetchData = async (req, res) => {
  try {
    const { inputText, extractor } = req.body;

    const requestBody = `text=${encodeURIComponent(inputText)}&extractors=${extractor}`;

    const response = await axios.post(
      "https://api.textrazor.com/",
      requestBody,
      {
        headers: {
          "X-TextRazor-Key": "",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error calling TextRazor API:", error);
    res.status(500).send("Error calling TextRazor API");
  }
};

//url fetch handler
const handleScanPage = async (req, res) => {
  try {
    const { url, extractor } = req.body;

    const requestBody = `url=${encodeURIComponent(url)}&extractors=${extractor}`;

    const response = await axios.post(
      "https://api.textrazor.com/",
      requestBody,
      {
        headers: {
          "X-TextRazor-Key": "",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error calling TextRazor API:", error);
    res.status(500).send("Error calling TextRazor API");
  }
};

module.exports = {
  handleFetchData,
  handleScanPage  
};
