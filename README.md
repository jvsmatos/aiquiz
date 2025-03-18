# AI-Quiz

A dynamic **Quiz Generator** app powered by **OpenAI**, built with **React.JS** and **Node.JS**, allowing users to generate custom quizzes on any topic. Questions are dynamically created using AI, validated for quality, and presented in a user-friendly interface with dark/light themes.

---

## 🚀 **Project Overview**

AI Quiz is a full-stack web app that transforms user-input topics into engaging quizzes. It leverages OpenAI's GPT-4 to generate questions, ensures data integrity through rigorous validation, and delivers a seamless experience with responsive design and theme customization.

---

## 🛠 **Tech Stack**

- **React.js + Vite** – Fast frontend with dynamic state management.
- **TailwindCSS + ShadCN UI** – To accelerate the styling process while maintaining a beautiful and responsive design.
- **Node.JS + Express** – Backend API for secure OpenAI integration.
- **OpenAI API (GPT-4)** – Generates quiz questions based on user input.
- **Axios** – HTTP communication between frontend and backend.
- **CORS** – Secure cross-origin resource sharing.
- **Vercel** – Deployment for frontend and serverless functions.

---

## 🔥 **Features**

- **Dynamic Quiz Generation** – Create quizzes on any topic using AI.
- **Dfficulty Levels** – Different levels to push the user with interesting questions.
- **Data Validation** – Backend validation ensures question structure and uniqueness.
- **Dark/Light Mode** – Theme toggle with localStorage persistence.
- **Progress Tracking and Timer** – Visual indicator for quiz completion.
- **Error Handling** – User-friendly messages for API failures or invalid data.
- **Rate Limiting** - Prevent API abuse with request throttling.
- **Secure API Integration** – Sensitive informations secure using environment variables.

---

## 💡 **Future Improvements**

Just a few ideas:

- **Enhanced Analytics** – Detailed quiz performance insights.
- **Source information** – Be able to help the users to learn new things from the Quiz.

![image](https://github.com/user-attachments/assets/34dad00d-c4dd-4045-a967-c467261912a1)
![image](https://github.com/user-attachments/assets/cea17ba2-f266-43c8-9a99-971fc821ff48)
![image](https://github.com/user-attachments/assets/5a3486ed-d3cf-41f0-a0db-b7d4ab45afb8)
![image](https://github.com/user-attachments/assets/19e46412-8f94-4b7a-b3b5-9e69ef03b750)






---

## 🌱 **Getting Started**

To run this project locally, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/jvsmatos/ai-quiz.git
```
### 2. Navigate to the project directory
```bash
cd ai-quiz
```
### 3. Set up the backend
```bash
cd server && npm install  
echo "OPENAI_API_KEY=your_key_here" > .env
```
### 4. Set up the frontend
```bash
cd ../client && npm install 
```
### 5. Start the servers
```bash
# Backend (from /server)  
npm start  

# Frontend (from /client)  
npm run dev  
```
Visit http://localhost:5173 in your browser to see the app in action.
