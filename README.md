<h1>🛠️ Aiding - Real-time Log Streaming Server</h1>

<p>
  Aiding is a lightweight Node.js Express server that provides real-time log streaming using Server-Sent Events (SSE). Clients can subscribe to logs for a specific <code>AppID</code>, and logs can be pushed dynamically to all active connections.
</p>

<h2>🚀 Features</h2>
<ul>
  <li>🌐 Real-time log updates using SSE</li>
  <li>📦 JSON-based API for log publishing</li>
  <li>🧹 Log filtering based on <code>AppID</code></li>
  <li>🔒 Clean client connection handling</li>
  <li>🌱 Lightweight and easy to deploy</li>
</ul>

<h2>📦 Tech Stack</h2>
<ul>
  <li>Node.js + TypeScript</li>
  <li>Express.js</li>
  <li>Server-Sent Events (SSE)</li>
  <li>dotenv</li>
  <li>CORS</li>
</ul>

<h2>📂 API Endpoints</h2>

<h3>🔁 <code>GET /logs?appid=YOUR_APP_ID</code></h3>
<p>Subscribe to logs for a specific App ID.</p>

<pre><code>Headers:
Accept: text/event-stream
</code></pre>

<pre><code>Response:
{
  "AppID": "your_app_id",
  "connectionInfo": {
    "ip": "::1",
    "browser": "user-agent string"
  }
}
</code></pre>

<h3>📝 <code>POST /write?appid=YOUR_APP_ID</code></h3>
<p>Send a new log entry.</p>

<pre><code>Body:
{
  "log": "Log message",
  "logtype": "info" // allowed: "info", "warning", "error", "other"
}
</code></pre>

<pre><code>Response:
{
  "success": true
}
</code></pre>

<h3>❤️ <code>GET /</code></h3>
<p>Check if the server is healthy.</p>

<hr />

<h2>📦 Getting Started</h2>

<h3>1. Clone the repo</h3>
<pre><code>git clone https://github.com/your-username/aiding.git
cd aiding
</code></pre>

<h3>2. Install dependencies</h3>
<pre><code>npm install
</code></pre>

<h3>3. Setup environment</h3>
<pre><code>// .env
PORT=3000
</code></pre>

<h3>4. Run the server</h3>
<pre><code>npm run dev
</code></pre>
<p><strong>Note:</strong> Use <code>npm run build && npm start</code> for production.</p>

<hr />

<h2>🐳 Run with Docker</h2> <h3>1. Build the Docker image</h3> <pre><code>docker build -t aiding-log-server .</code></pre> <h3>2. Run the container</h3> <pre><code>docker run -d -p 3000:3000 --env-file .env aiding-log-server</code></pre> <p> This will start the server in the background and expose it on port <code>3000</code>. Make sure your <code>.env</code> file exists in the root directory with proper configuration like: </p> <pre><code>// .env PORT=3000 </code></pre> <h3>✅ Check if it's running</h3> <pre><code>curl http://localhost:3000/</code></pre> <p> You should see a response indicating the server is healthy. </p>

<h2>✨ License</h2>
<p>This project is licensed under the MIT License.</p>
