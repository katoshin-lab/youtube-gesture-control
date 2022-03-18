module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "webextensions": true
    },
    "extends": [
        "plugin:react/recommended",
        "airbnb"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "@typescript-eslint"
    ],
    "rules": {
        "no-underscore-dangle": 0,
        "class-methods-use-this": 0,
        "import/no-unresolved": 0,
        "import/extensions": 0,
        "react/function-component-definition": 0,
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx", ".tsx"] }],
        "linebreak-style": 0,
        "jsx-quotes": 0,
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["error"],
        "jsx-a11y/click-events-have-key-events": 0,
        "jsx-a11y/no-static-element-interactions": 0
    }
}
