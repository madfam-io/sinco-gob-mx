# Interactive SINCO 2019 Data Visualization 📊

This project is a single-page web application that provides an interactive visualization of Mexico's **Sistema Nacional de Clasificación de Ocupaciones (SINCO) 2019**. It's designed to allow users to easily explore the hierarchical structure of occupations, view detailed labor statistics, and search for specific roles using a modern, responsive interface.

The entire application is self-contained in a single `index.html` file, using vanilla JavaScript and the D3.js library for dynamic visualizations.

---

## ✨ Features

- **Multiple Data Views:** Switch seamlessly between three different ways to explore the data:
  - 🌳 **Tree View:** An interactive, collapsible tree diagram powered by D3.js.
  - 📋 **Table View:** A detailed, searchable table of all occupations.
  - 📇 **Cards View:** A high-level summary of each main occupational division.
- **Powerful Search:** A unified search bar allows you to instantly find occupations by name, official code, or even filter by salary across all views.
- **Interactive D3.js Visualization:**
  - **Zoom & Pan:** Easily navigate large sections of the occupational tree.
  - **Expand & Collapse:** Click on nodes to reveal or hide their sub-categories.
  - **Highlighting:** Search results and selected items are highlighted for clarity. Clicking an item in the Table or Cards view automatically finds and centers it in the Tree view.
- **Detailed Tooltips:** Hover over any node in the tree to get instant statistics like average salary, employee count, and formality rate.
- **Dashboard Header:** Key metrics like total occupations, divisions, total employees, and the national average salary are always visible.
- **Responsive Design:** The dark-themed UI is fully responsive and optimized for both desktop and mobile devices.

---

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3 (Custom Properties), Vanilla JavaScript (ES6+)
- **Visualization Library:** [D3.js](https://d3js.org/) (v7.8.5)
- **Data Format:** `JSON`
- **Fonts:** [Google Fonts](https://fonts.google.com/) (Inter)

---

## 🚀 Getting Started

To run this project locally, you need to serve the `index.html` file from a local web server. You cannot open the file directly in your browser using the `file://` protocol due to browser security policies (CORS) that prevent JavaScript from fetching the local `sincoData.json` file.

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge).
- A local web server environment.

### Installation & Launch

1.  **Clone the repository or download the files:**

    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd your-repo-name
    ```

2.  **Ensure `sincoData.json` is in the same directory as `index.html`.**

3.  **Launch a local server.** Here are two easy methods:
    - **Using the VS Code Live Server Extension (Easiest)**
      1.  Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension in Visual Studio Code.
      2.  Right-click the `index.html` file and select "Open with Live Server".

    - **Using Python's Built-in HTTP Server**
      1.  Open your terminal or command prompt in the project's root directory.
      2.  Run the appropriate command for your Python version:

          ```bash
          # Python 3.x
          python -m http.server

          # Python 2.x
          python -m SimpleHTTPServer
          ```

      3.  Open your browser and navigate to `http://localhost:8000`.

---

## 📂 Code Overview

The application logic is contained within a single `<script>` tag inside `index.html` and is structured for clarity and maintainability.

- **IIFE (Immediately Invoked Function Expression):** The entire script is wrapped in an IIFE `(function() { ... })();` to create a private scope, preventing pollution of the global namespace.
- **State Management:** A central `state` object holds the application's current view, data, and D3 object references.
- **DOM Cache:** A `DOM` object holds references to frequently accessed HTML elements for improved performance.
- **Logical Sections:** The code is organized into clear, commented sections:
  - `INITIALIZATION`: Handles the main data fetching and setup.
  - `DATA PROCESSING & HELPERS`: Contains utility functions for calculations and data manipulation.
  - `D3 & VISUALIZATION LOGIC`: Manages the D3 tree, including setup, updates, and zooming.
  - `RENDERING LOGIC`: Functions responsible for populating the Table and Cards views.
  - `EVENT HANDLERS`: Manages all user interactions, such as clicks, search input, and window resizing.
