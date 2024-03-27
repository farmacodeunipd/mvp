module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "es2021": true,
        "jest": true,
        "mocha": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "overrides": [
        {
            "files": [
                "**/__tests__/*.{js,jsx}"
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

  