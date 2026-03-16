# Book Catalog Application - JavaScript Assignment - Compro Technologies

## Overview

This project is a dynamic **Book Catalog Web Application** built using **HTML, CSS, and JavaScript**. It allows users to explore, search, filter, and sort a collection of books loaded from a remote JSON dataset. The application focuses on responsive UI design, efficient data handling, and modern JavaScript asynchronous programming techniques.

The project includes **two implementations for asynchronous operations**:

* Promise-based implementation
* Async/Await-based implementation

## Features

### Book Data Management

* Fetches book data from a remote JSON source
* Stores processed data in **Local Storage** for faster reloads
* Handles API failures and data loading errors gracefully

### Advanced Search

* Search by **book name, author, ID, and language**
* **Price range filtering**
* **Publication year range filtering**
* **Tag-based multi-genre selection**

### Sorting and Pagination

* Sort books by:

  * Price (ascending / descending)
  * Publication year (ascending / descending)
* Custom pagination options:

  * 5 rows
  * 10 rows
  * 25 rows

### Book Details and Recommendations

* Clicking a book displays detailed information in the **Examined Book panel**
* Shows **similar books** based on:

  * Same genre
  * ±10% price range

### Performance Optimization

* **Lazy loading** for book cover images
* **LocalStorage caching** to avoid repeated API requests

### User Interface

* Responsive layout using **Bootstrap and Flexbox**
* **Dark / Light mode toggle**
* Clean and accessible UI design

## Project Structure

```
project/
│
├── index.html          # Landing page
├── app.html            # Main application
│
├── scripts-promises.js # Promise-based implementation
├── scripts-async.js    # Async/Await implementation
│
├── style.css           # Application styles
└── README.md
```

## How to Run

1. Clone the repository
2. Open `index.html` in a browser
3. Click **"Let's Go"** to launch the application

No additional setup or dependencies are required.

## Technologies Used

* HTML5
* CSS3
* Bootstrap
* JavaScript
* LocalStorage API
* Fetch API

## Learning Outcomes

This project demonstrates:

* Asynchronous programming using **Promises and Async/Await**
* Efficient DOM manipulation
* Client-side filtering, sorting, and pagination
* Performance optimizations in web applications
* Responsive UI design with modern CSS techniques

---

Thank you for reviewing this project.
