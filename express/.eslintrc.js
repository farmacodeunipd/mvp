module.exports = {
    "env": {
      "browser": true,
      "node": true, // Include Node.js environment
      "es2021": true,
      "jest": true, // Include Jest environment
      "mocha": true // Include Mocha environment
    },
    "extends": [
      "eslint:recommended",
      "plugin:react/recommended"
    ],
    "overrides": [
      {
        "files": [
          "**/__tests__/*.{js,jsx}" // Override settings for test files
        ],
        "env": {
          "jest": true,
          "mocha": true
        }
      }
    ],
    "parserOptions": {
      "ecmaVersion": "latest",
      "sourceType": "module"
    },
    "plugins": [
      "react"
    ],
    "rules": {
      // Define any custom rules or override existing rules here
    }
  }
  