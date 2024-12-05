# ngx-seedkit

**ngx-seedkit** is a lightweight and customizable **wallet connection library** for **Angular**, inspired by RainbowKit. Built on top of **ngx-wagmi**, it provides an elegant solution to integrate Web3 wallet connection features into your Angular applications with ease.

## 🚀 Features

- **Plug-and-play**: Pre-built UI component for wallet connection.
- **Customizable**: Style and extend as needed.
- **Powered by ngx-wagmi**: Seamless integration with wagmi-compatible Web3 tools.

## 📦 Installation

Install ngx-seedkit via npm:

```bash
npm install ngx-seedkit
```

## 🛠️ Setup

1. **Configure Assets & Styles**  
   Update the `angular.json` file to include the library's assets & styles:

   ```json
   "assets": [
     {
       "glob": "**/*",
       "input": "node_modules/ngx-seedkit/assets",
       "output": "/"
     }
   ],
    "styles": ["node_modules/ngx-seedkit/styles/index.css", ...],

   ```

2. **Use the Component**  
   Add the `app-connect-button` component to your Angular application. This component provides a pre-built button for wallet connection.

   Example usage in an Angular template:

   ```html
   <app-connect-button></app-connect-button>
   ```

   The button will handle wallet connections automatically, integrating with the **ngx-wagmi** backend.

---

## 🌟 Demo

Explore the live demo and source code:  
👉 **Demo App**: [ngx-wagmi.vercel.app](https://ngx-wagmi.vercel.app/)  
👉 **GitHub Repository**: [ngx-wagmi](https://github.com/thanhhoa214/ngx-wagmi)

---

## 📖 Documentation

WIP

---

## 💬 Feedback & Contributions

We welcome your feedback and contributions! Feel free to open issues or submit pull requests on GitHub to help us improve ngx-seedkit.

---

## 🌟 License

This library is licensed under the [MIT License](LICENSE).
