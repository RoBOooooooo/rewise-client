# Rewise - Client Side

**Rewise** is a modern, feature-rich web application designed for sharing and discovering life lessons. Built with the latest web technologies, it offers a seamless experience for users to connect, learn, and grow.

## 🚀 Live Demo
**[Visit Live Website](https://rewise-arif.vercel.app)**

## ✨ Key Features
*   **🔐 Secure Authentication**: Firebase-powered Login and Registration with Google Sign-in support.
*   **🎨 Modern UI/UX**: Built with Tailwind CSS v4, featuring a global **Dark/Light Mode** toggle.
*   **📱 Responsive Dashboard**: Comprehensive User and Admin dashboards for managing content.
*   **📚 Lesson Management**: Create, edit, and manage lessons with rich text and cover images.
*   **📤 Social Sharing & PDF**: Share lessons to Facebook, X, LinkedIn, or download as a beautifully formatted PDF.
*   **🔍 Advanced Search**: Filter lessons by category, perform keyword searches, and sort by popularity/date.
*   **⚡ Optimization**: Client-side pagination and optimized assets for fast performance.
*   **✨ Interactive Elements**: Lottie animations for engagement and toast notifications for feedback.

## 🛠️ Tech Stack
*   **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Authentication**: [Firebase Auth](https://firebase.google.com/)
*   **State Management**: React Context API
*   **HTTP Client**: Axios
*   **Additional Libs**:
    *   `react-router-dom` (Routing)
    *   `@react-pdf/renderer` (PDF Export)
    *   `lottie-react` (Animations)
    *   `react-hot-toast` (Notifications)
    *   `recharts` (Data Visualization)

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/rewise-client.git
    cd rewise-client
    ```

2.  **Install Dependencies**
    ```bash
    npm install --legacy-peer-deps
    ```
    *> Note: Use `--legacy-peer-deps` to resolve React 19 peer dependency conflicts.*

3.  **Environment Configuration**
    Create a `.env` file in the root directory:
    ```env
    VITE_apiKey=your_firebase_api_key
    VITE_authDomain=your_firebase_auth_domain
    VITE_projectId=your_firebase_project_id
    VITE_storageBucket=your_firebase_storage_bucket
    VITE_messagingSenderId=your_firebase_sender_id
    VITE_appId=your_firebase_app_id
    VITE_IMGBB_API_KEY=your_imgbb_api_key
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

5.  **Build for Production**
    ```bash
    npm run build
    ```

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).

---
*Developed by Mujahidul Islam Arif*
