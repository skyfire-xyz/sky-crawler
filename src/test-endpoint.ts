import axios from "axios";

(async () => {
  const paymentEndpoint = "http://localhost:3000/v1/crawler/uuid";

  try {
    const response = await axios.get(paymentEndpoint);
    console.log("here:", response.data);
  } catch (error) {
    console.error("Error processing payment:", error);
  }
})();
