let chatHistory = [];

async function sendMessage() {
  const input = document.getElementById("user-input");
  const subject = document.getElementById("subject-select").value;
  const message = input.value.trim();
  if (!message) return;

  appendMessage("user", message);
  chatHistory.push({ role: "user", content: message, subject });

  input.value = "";

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        message, 
        subject, 
        history: chatHistory
      }),
    });

    const data = await response.json();
    appendMessage("bot", data.reply);
    chatHistory.push({ role: "bot", content: data.reply });
  } catch (error) {
    appendMessage("bot", "Error: Could not reach server.");
    console.error(error);
  }
}

function appendMessage(sender, text) {
  const chatBox = document.getElementById("chat-box");
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.innerText = text; // only the message content
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
