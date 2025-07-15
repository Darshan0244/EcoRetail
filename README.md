<h1 align="center">🌿 EcoRetail</h1>

<p align="center">
  <strong>Build a Sustainable Future for Retail</strong>
</p>

<p align="center">
  <em>Empowering eco-conscious retail through AI, automation, and sustainable intelligence.</em>
</p>

<br />
<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" />
  <img src="https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat" alt="Contributions Welcome" />
  <img src="https://img.shields.io/badge/Next.js-15.0-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Genkit-1.13-blueviolet?logo=google-cloud" alt="Genkit" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript" alt="TypeScript" />
</p>



## 📖 Table of Contents

<p align="center">
  <a href="#about-the-project">About The Project</a> •
  <a href="#-key-features">✨ Key Features</a> •
  <a href="#-built-with">🚀 Built With</a> •
  <a href="#-getting-started">🏁 Getting Started</a> •
  <a href="#prerequisites">Prerequisites</a> •
  <a href="#installation--setup">Installation & Setup</a> •
  <a href="#-how-to-contribute">🤝 How to Contribute</a> •
  <a href="#️-future-roadmap">🛣️ Future Roadmap</a> •
  <a href="#-license">📜 License</a>
</p>

---

## 🧩 About The Project

**EcoRetail** is an innovative platform designed to empower retail businesses with AI-driven tools for sustainability. In an era where environmental responsibility is paramount, EcoRetail provides a comprehensive suite to reduce waste, minimize carbon footprints, optimize resource usage, and build a more ethical brand.

Our mission is to make sustainability actionable and measurable for retailers, contributing to a greener planet while improving operational efficiency and consumer trust.

![EcoRetail Banner](https://res.cloudinary.com/dtjjgiitl/image/upload/q_auto:good,f_auto,fl_progressive/v1752574493/lyuraba6jrwsg1tsnz0i.jpg)


---

## ✨ Key Features

- **🚛 Supply Chain AI**: Optimizes inventory levels and logistics to minimize waste and reduce transportation-related carbon emissions.  
- **🌿 Carbon Display**: Visually demonstrates the carbon footprint of products, enabling informed, sustainable decisions.  
- **🛡️ Source Verification**: Utilizes transparent ledger technology concepts to verify the ethical and environmental claims of suppliers.  
- **⚡ Energy Management AI**: Analyzes and optimizes energy consumption in retail stores, reducing electricity use and costs.  
- **📦 Eco-Friendly Packaging Guide**: Suggests sustainable packaging options based on product type, volume, and travel distance.  
- **✨ Alternative Finder**: Leverages AI to find and suggest environmentally friendly alternatives to conventional products.  

---

## 🚀 Built With

This project leverages a modern and robust technology stack to deliver a seamless and powerful user experience.

| Tech                    | Description                                                        |
|-------------------------|--------------------------------------------------------------------|
| **Next.js**             | React framework for server-side rendering & performance.           |
| **React**               | Library for building dynamic user interfaces.                      |
| **TypeScript**          | For type safety and improved code quality.                         |
| **Tailwind CSS**        | Utility-first CSS framework for rapid styling.                     |
| **ShadCN UI**           | Aesthetically-pleasing, accessible component library.              |
| **Genkit & Gemini**     | Powers the AI features and generative capabilities.                |
| **Firebase App Hosting**| Scalable, serverless hosting platform.                             |
| **Lucide Icons**        | Beautiful and consistent open-source icons.                        |

---

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### 🔧 Prerequisites

You need to have Node.js (version 20 or later) and npm installed on your machine.

- **Node.js**: [Download & Install Node.js](https://nodejs.org/en/download/)  
- **Google AI API Key**:  
  1. Obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).  
  2. This key is required to run the AI features of the application.  

### ⚙️ Installation & Setup

1. **Clone the Repository**
    ```bash
    git clone https://github.com/Darshan0244/EcoRetail.git
    cd EcoRetail
    ```

2. **Install NPM Packages**
    ```bash
    npm install
    ```

3. **Set Up Environment Variables**  
   Create a file named `.env` in the root of your project and add your Google AI API key:
    ```env
    GOOGLE_API_KEY=YOUR_API_KEY_HERE
    ```

4. **Run the Development Servers**  
   You need to run two separate processes in two different terminal windows:

    - **Terminal 1** — Start Genkit AI flows:
      ```bash
      npm run genkit:watch
      ```

    - **Terminal 2** — Start the Next.js frontend:
      ```bash
      npm run dev
      ```

    Then open [http://localhost:9002](http://localhost:9002) in your browser.

---

## 🤝 How to Contribute

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. **Fork the Project**  
2. **Create your Feature Branch**
    ```bash
    git checkout -b feature/AmazingFeature
    ```
3. **Commit your Changes**
    ```bash
    git commit -m "Add some AmazingFeature"
    ```
4. **Push to the Branch**
    ```bash
    git push origin feature/AmazingFeature
    ```
5. **Open a Pull Request**

Please make sure your code follows the project's coding standards and that you have tested your changes.

---

## 🛣️ Future Roadmap

We have exciting plans to expand the capabilities of EcoRetail!

- [ ] **Full Backend Integration** – Node.js + DB (PostgreSQL/Firestore)  
- [ ] **User Authentication** – Secure login for personalized access  
- [ ] **Advanced Analytics Dashboard** – Detailed visualizations and trends  
- [ ] **E-commerce Integration** – Connect with Shopify/WooCommerce  
- [ ] **Mobile Application** – Companion mobile app for retailers  

See the [open issues](https://github.com/Darshan0244/EcoRetail/issues) for a full list of proposed features and known issues.

---

## 📜 License

Distributed under the **MIT License**.
