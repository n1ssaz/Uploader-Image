const clients = []; // Store SSE clients

// SSE Endpoint to Listen for Events
export const eventsHandler = (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  clients.push(res);

  req.on("close", () => {
    clients.splice(clients.indexOf(res), 1);
  });
};

// Function to Notify Clients to Refetch Notifications
export const sendEvent = () => {
  clients.forEach((client) => {
    client.write(`event: notification-update\n`);
    client.write(`data: {}\n\n`); // Sending an empty object since the FE will refetch
  });
};
