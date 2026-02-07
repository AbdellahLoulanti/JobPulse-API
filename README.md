# JobPulse API 🚀

JobPulse is a high-performance Job Board REST API built with **Django REST Framework**. It is designed to demonstrate modern backend architectures using **Asynchronous Tasks**, **Caching**, and **Containerization**.

## 🛠 Tech Stack

* **Framework:** Django REST Framework (DRF)
* **Database:** PostgreSQL (Relational storage)
* **Task Queue:** Celery (Background workers)
* **Message Broker:** Redis (Communication between Django & Celery)
* **Caching:** Redis (Speeding up repetitive queries)
* **Reverse Proxy:** Nginx (Static files & request routing)
* **Infrastructure:** Docker & Docker Compose

## 🏗 System Architecture

The project follows a decoupled architecture:
1.  **Nginx** acts as the entry point (Port 80).
2.  **Django** handles business logic and signals.
3.  **Signals** trigger **Celery Tasks** upon job creation.
4.  **Redis** stores the tasks in a queue and caches popular job listings.
5.  **PostgreSQL** ensures persistent data storage.



## ✨ Key Features

- **Job Management:** Full CRUD for job offers (Title, Company, Salary, etc.).
- **Asynchronous Notifications:** When a job is posted, a Django **Signal** triggers a **Celery Task** to simulate email notifications (avoiding request blocking).
- **High Performance:** Trending jobs are cached in **Redis** to reduce database load.
- **Dockerized Environment:** One command to spin up the entire infrastructure.

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose installed.

### Installation
1. Clone the repository:
   ```bash
   git clone [https://github.com/your-username/job-pulse-api.git](https://github.com/your-username/job-pulse-api.git)
   cd job-pulse-api
