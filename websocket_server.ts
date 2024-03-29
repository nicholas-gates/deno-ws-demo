// Function to handle WebSocket connections
async function handleWebSocket(request: Request): Promise<Response> {
    // Upgrade the HTTP request to a WebSocket connection
    const { socket, response } = Deno.upgradeWebSocket(request);

    socket.onopen = () => console.log("WebSocket connection opened.");
    socket.onmessage = (event) => {
        console.log("Received message from client:", event.data);
        // Echo the received message back to the client
        socket.send(`Server received: ${event.data}`);
    };
    socket.onerror = (event) => console.error("WebSocket error:", event);
    socket.onclose = () => console.log("WebSocket connection closed.");

    // Return the response to finalize the WebSocket upgrade
    return response;
}

// Create a server that listens on port 8000
console.log("WebSocket server started on ws://localhost:8000");
Deno.serve(async (req) => {
    // Check if the request is attempting to upgrade to WebSocket
    if (req.headers.get("upgrade") === "websocket") {
        return handleWebSocket(req);
    } else {
        // Handle normal HTTP requests here
        return new Response("Hello, this is a WebSocket server!");
    }
}, { port: 8000 });
