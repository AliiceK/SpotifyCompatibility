# Spotify Music Profile Compatibility Checker

This project is a web application that compares the music profiles of two Spotify users and shows how compatible they are based on their music preferences.

## Features

- User authentication with Spotify
- Fetching user's top artists and tracks
- Comparing music profiles of two users
- Displaying compatibility score

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- npm
- A Spotify Developer account

### Installation

1. Clone the repository
  ```
  git clone https://github.com/AliiceK/SpotifyCompatibility
  ```
2. Install NPM packages
  ```
  cd server && npm install cd ../client && npm install
  ```
3. Create a new `.env` file based on the `.env.sample` and enter your API information.
4. Start the server
  ```
  cd server && npm start
  ```
5. Start the client
  ```
  cd client && npm start
  ```
## Usage

Enter the Spotify usernames of two users and click on the 'Check Compatibility' button. The application will display a compatibility score based on the music profiles of the two users.
