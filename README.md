
# EagleTask

EagleTask is a Canvas-integrated AI assistant designed to help students manage their academic tasks and schedules efficiently. Built with React, FastAPI, and OpenAI, EagleTask provides features like AI-generated weekly task lists, grade summaries, and a scheduling assistant to help students stay organized and productive.

## Features

- **Canvas API Integration:** Connects to Canvas to retrieve course, assignment, module, and grade data.
- **AI Task Management:** Generates a weekly to-do list based on Canvas assignments and deadlines.
- **Interactive Assistant:** Uses OpenAI for question-answering, task prioritization, and schedule adjustments.
- **Grade Tracking:** Displays current grades and updates as assignments are completed.

## Getting Started

To set up EagleTask on your local machine, follow these steps:

### Prerequisites

- [Python 3.8+](https://www.python.org/downloads/)
- [Node.js and npm](https://nodejs.org/) (for the React frontend)
- A Canvas API key for accessing your Canvas account data

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/eagle-task.git
   cd eagle-task
   ```

2. **Backend Setup (FastAPI):**
   - Create a virtual environment:
     ```bash
     python3 -m venv venv
     source venv/bin/activate  # On Windows: venv\Scripts\activate
     ```
   - Install Python dependencies:
     ```bash
     pip install -r requirements.txt
     ```
   - Navigate to the FastAPI backend directory and start the server:
     ```bash
     uvicorn main:app --reload
     ```

3. **Frontend Setup (React):**
   - Navigate to the `eagle-task` frontend directory:
     ```bash
     cd eagle-task
     ```
   - Install React dependencies:
     ```bash
     npm install
     ```
   - Start the React frontend:
     ```bash
     npm start
     ```

### Usage

Once both servers are running, open your browser and go to `http://localhost:3000` to access EagleTask. Use your Canvas API key to connect and start exploring your courses and assignments!

## Configuration

- **Canvas API Key:** Obtain your Canvas API key from your account settings on Canvas, and enter it in EagleTask to enable data synchronization.
- **Environment Variables:** If any environment variables (e.g., for API keys) are required, add them to a `.env` file in the backend root directory.

## Contributing

We welcome contributions! Please open a pull request for any changes or new features you would like to add.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

---
