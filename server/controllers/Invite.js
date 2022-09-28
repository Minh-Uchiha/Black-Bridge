const axios = require("axios");
const fetch = require("node-fetch");
const { v4: uuidV4 } = require("uuid");

const url = `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`;

const inviteAgent = async (req, res) => {
  const { base64Image, currentURL } = req.body;
  let roomNumber = null;
  try {
    // Get the text by parsing the image
    const result = await axios.post(url, {
      requests: [
        {
          image: {
            content: base64Image,
          },
          features: [
            {
              type: "DOCUMENT_TEXT_DETECTION",
              maxResults: 1,
            },
          ],
        },
      ],
    });
    const text = result.data.responses[0].fullTextAnnotation.text;

    // Check if the command is create a new room or not
    if (
      text.toLowerCase().includes("create") &&
      text.toLowerCase().includes("room")
    ) {
      roomNumber = uuidV4();
      console.log(roomNumber);
    }

    if (text.includes("@")) {
      // Check if the command is sending email or not
      const email = text.replace(/\r?\n|\r/g, "").replace(/\s/g, "");
      const emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (email.match(emailRegex)) {
        console.log("Match!");

        // Set up courier options
        const courier_options = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + process.env.COURIER_API_KEY,
          },
          body: JSON.stringify({
            message: {
              to: {
                email: email,
              },
              content: {
                title: "new secret message",
                body:
                  "Hi agent X, there is an invitation sent by an anonymous agent to you. Click the link below to accept the invitation: " +
                  currentURL,
              },
            },
          }),
        };

        // Send an email to an agent
        fetch("https://api.courier.com/send", courier_options)
          .then((response) => response.json())
          .then((response) => console.log(response))
          .catch((err) => console.error(err));
      }
    }

    res.status(200).json({
      message: text,
      roomNumber: roomNumber,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { inviteAgent };
