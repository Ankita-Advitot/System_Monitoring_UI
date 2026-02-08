export const AUTH_VALIDATION = {
    NAME: {
        MIN: 2,
        MAX: 50,
        REGEX: /^[A-Za-z\s]+$/,
        MESSAGE: 'Name can only contain letters and spaces',
    },
    EMAIL: {
        REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        MESSAGE: 'Please enter a valid email address (e.g., user@example.com)',
    },
    PASSWORD: {
        MIN: 8,
        MAX: 64,
        UPPERCASE_REGEX: /[A-Z]/,
        LOWERCASE_REGEX: /[a-z]/,
        NUMBER_REGEX: /[0-9]/,
        SPECIAL_CHAR_REGEX: /[!@#$%^&*(),.?":{}|<>]/,
        NO_SPACE_REGEX: /^\S+$/,
    },
} as const;

export const PASSWORD_REQUIREMENTS = [
    { id: 'length', label: 'At least 8 characters', regex: /.{8,}/ },
    { id: 'uppercase', label: 'One uppercase letter', regex: /[A-Z]/ },
    { id: 'lowercase', label: 'One lowercase letter', regex: /[a-z]/ },
    { id: 'number', label: 'One number', regex: /[0-9]/ },
    { id: 'special', label: 'One special character', regex: /[!@#$%^&*(),.?":{}|<>]/ },
] as const;
