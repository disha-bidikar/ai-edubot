const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatBox = document.getElementById("chat-box");
const subjectSelect = document.getElementById("subject");
const messageSound = document.getElementById("message-sound");

let chatHistory = [];

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = chatInput.value.trim();
  if (!message) return;

  // User message
  const userDiv = document.createElement("div");
  userDiv.className = "message user";
  userDiv.innerHTML = `<b>You:</b> ${message}`;
  chatBox.appendChild(userDiv);
  chatInput.value = "";
  chatHistory.push({ role: "user", content: message });

  chatBox.scrollTop = chatBox.scrollHeight;
  messageSound.play();

  // Typing indicator
  const typingDiv = document.createElement("div");
  typingDiv.className = "message bot";
  typingDiv.innerHTML = `
    <div class="typing-dots">
      <span></span><span></span><span></span>
    </div>`;
  chatBox.appendChild(typingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        subject: subjectSelect.value,
        history: chatHistory
      })
    });

    const data = await response.json();
    typingDiv.remove();

    const botDiv = document.createElement("div");
    botDiv.className = "message bot";
    botDiv.innerHTML = `<b>EduBot:</b> ${data.reply}`;
    chatBox.appendChild(botDiv);
    chatHistory.push({ role: "assistant", content: data.reply });

    chatBox.scrollTop = chatBox.scrollHeight;
    messageSound.play();
  } catch (err) {
    typingDiv.remove();
    console.error(err);
  }
});
