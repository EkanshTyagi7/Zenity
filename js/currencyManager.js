class CurrencyManager {
  constructor() {
    this.coins = 300;
    this.stars = 250;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found, using default currency values");
        return;
      }

      const response = await fetch("http://localhost:8001/api/auth/currency", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          this.coins = data.coins;
          this.stars = data.stars;
          this.isInitialized = true;
          this.updateUI();
        }
      }
    } catch (err) {
      console.error("Error initializing currency:", err);
    }
  }

  async updateCurrency(newCoins = null, newStars = null) {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const updateData = {};
      if (newCoins !== null) updateData.coins = newCoins;
      if (newStars !== null) updateData.stars = newStars;

      const response = await fetch("http://localhost:8001/api/auth/currency", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          this.coins = data.coins;
          this.stars = data.stars;
          this.updateUI();
          return data;
        }
      }
    } catch (err) {
      console.error("Error updating currency:", err);
    }
    return null;
  }

  updateUI() {
    const coinsElements = document.querySelectorAll(
      '[id="coins"], .coins-display'
    );
    coinsElements.forEach((element) => {
      element.textContent = this.coins;
    });

    const starsElements = document.querySelectorAll(
      '[id="stars"], .stars-display'
    );
    starsElements.forEach((element) => {
      element.textContent = this.stars;
    });

    const iconItems = document.querySelectorAll(".icon-item span");
    if (iconItems.length >= 2) {
      iconItems[0].textContent = this.stars;
      iconItems[1].textContent = this.coins;
    }
  }

  getCurrency() {
    return {
      coins: this.coins,
      stars: this.stars,
    };
  }

  hasEnoughCurrency(amount, type = "coins") {
    if (type === "stars") {
      return this.stars >= amount;
    }
    return this.coins >= amount;
  }

  async deductCurrency(amount, type = "coins") {
    if (type === "stars") {
      return await this.updateCurrency(null, this.stars - amount);
    } else {
      return await this.updateCurrency(this.coins - amount, null);
    }
  }
}

window.currencyManager = new CurrencyManager();

document.addEventListener("DOMContentLoaded", () => {
  window.currencyManager.initialize();
});
