class CommunityApp {
  constructor() {
    this.socket = null;
    this.currentChannel = null;
    this.currentUser = null;
    this.channels = {};

    this.initializeElements();
    this.checkAuth();
    this.initializeSocket();
    this.loadChannels();
    this.bindEvents();
  }

  initializeElements() {
    this.channelsContainer = document.querySelector(".channels-container");
    this.messagesContainer = document.getElementById("messages-container");
    this.messageInput = document.getElementById("message-input");
    this.sendButton = document.getElementById("send-button");
    this.currentChannelName = document.getElementById("current-channel-name");
    this.channelDescription = document.getElementById("channel-description");
    this.currentUserName = document.getElementById("current-user-name");
  }

  async checkAuth() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "signIn.html";
        return;
      }

      const response = await fetch("http://localhost:8001/api/auth/verify", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        localStorage.removeItem("token");
        window.location.href = "signIn.html";
        return;
      }

      const data = await response.json();
      this.currentUser = data.user;
      this.currentUserName.textContent = `Welcome, ${this.currentUser.name}!`;
    } catch (error) {
      console.error("Auth check failed:", error);
      window.location.href = "signIn.html";
    }
  }

  initializeSocket() {
    this.socket = io("http://localhost:8001");

    this.socket.on("connect", () => {
      console.log("Connected to server");
    });

    this.socket.on("message-received", (message) => {
      this.addMessageToUI(message);
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
  }

  async loadChannels() {
    try {
      const response = await fetch(
        "http://localhost:8001/api/community/channels"
      );
      const data = await response.json();

      if (data.success) {
        this.channels = data.channels;
        this.renderChannels();
      }
    } catch (error) {
      console.error("Failed to load channels:", error);
      this.showError("Failed to load channels");
    }
  }

  renderChannels() {
    this.channelsContainer.innerHTML = "";

    Object.keys(this.channels).forEach((category) => {
      const categoryDiv = document.createElement("div");
      categoryDiv.className = "channel-category";

      const categoryHeader = document.createElement("div");
      categoryHeader.className = "category-header";
      categoryHeader.textContent = category;

      const channelList = document.createElement("ul");
      channelList.className = "channel-list";

      this.channels[category].forEach((channel) => {
        const channelItem = document.createElement("li");
        channelItem.className = "channel-item";

        const channelLink = document.createElement("a");
        channelLink.href = "#";
        channelLink.className = "channel-link";
        channelLink.innerHTML = `<i class="fas fa-hashtag"></i>${channel.name}`;
        channelLink.dataset.channelId = channel._id;

        channelLink.addEventListener("click", (e) => {
          e.preventDefault();
          this.selectChannel(channel);
        });

        channelItem.appendChild(channelLink);
        channelList.appendChild(channelItem);
      });

      categoryDiv.appendChild(categoryHeader);
      categoryDiv.appendChild(channelList);
      this.channelsContainer.appendChild(categoryDiv);
    });
  }

  async selectChannel(channel) {
    document.querySelectorAll(".channel-link").forEach((link) => {
      link.classList.remove("active");
    });
    document
      .querySelector(`[data-channel-id="${channel._id}"]`)
      .classList.add("active");

    this.currentChannel = channel;
    this.currentChannelName.textContent = `#${channel.name}`;
    this.channelDescription.textContent = `Channel in ${channel.category}`;

    this.messageInput.disabled = false;
    this.sendButton.disabled = false;

    if (this.socket) {
      this.socket.emit("join-channel", channel._id);
    }

    await this.loadMessages(channel._id);

    const welcomeMessage =
      this.messagesContainer.querySelector(".welcome-message");
    if (welcomeMessage) {
      welcomeMessage.remove();
    }
  }

  async loadMessages(channelId) {
    try {
      const response = await fetch(
        `http://localhost:8001/api/community/channels/${channelId}/messages`
      );
      const data = await response.json();

      if (data.success) {
        this.messagesContainer.innerHTML = "";
        data.messages.forEach((message) => {
          this.addMessageToUI(message);
        });
        this.scrollToBottom();
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
      this.showError("Failed to load messages");
    }
  }

  async sendMessage() {
    const content = this.messageInput.value.trim();
    if (!content || !this.currentChannel) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8001/api/community/channels/${this.currentChannel._id}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content }),
        }
      );

      const data = await response.json();

      if (data.success) {
        this.messageInput.value = "";
        this.addMessageToUI(data.message);
        this.scrollToBottom();

        if (this.socket) {
          this.socket.emit("new-message", {
            channelId: this.currentChannel._id,
            message: data.message,
          });
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      this.showError("Failed to send message");
    }
  }

  addMessageToUI(message) {
    const messageDiv = document.createElement("div");
    messageDiv.className = "message";

    const time = new Date(message.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    messageDiv.innerHTML = `
            <div class="message-header">
                <span class="message-author">${message.user.name}</span>
                <span class="message-time">${time}</span>
            </div>
            <div class="message-content">${this.escapeHtml(
              message.content
            )}</div>
        `;

    this.messagesContainer.appendChild(messageDiv);
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  showError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "message error-message";
    errorDiv.innerHTML = `
            <div class="message-content">
                <i class="fas fa-exclamation-triangle"></i> ${message}
            </div>
        `;
    this.messagesContainer.appendChild(errorDiv);

    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }

  bindEvents() {
    this.sendButton.addEventListener("click", () => {
      this.sendMessage();
    });

    this.messageInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    this.messageInput.addEventListener("input", () => {
      this.messageInput.style.height = "auto";
      this.messageInput.style.height = this.messageInput.scrollHeight + "px";
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new CommunityApp();
});
