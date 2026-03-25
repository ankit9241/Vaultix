/**
 * Parses a string content (typically from a .env file) into an array of objects
 * @param {string} content - The .env file content
 * @returns {Array<{key: string, value: string}>}
 */
export const parseEnvContent = (content) => {
    if (!content) return [];

    const lines = content.split('\n');
    const result = [];

    lines.forEach(line => {
        // Remove comments and whitespace
        const trimmedLine = line.split('#')[0].trim();
        if (!trimmedLine) return;

        // Find the first equals sign
        const index = trimmedLine.indexOf('=');
        if (index === -1) return;

        const key = trimmedLine.substring(0, index).trim();
        let value = trimmedLine.substring(index + 1).trim();

        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.substring(1, value.length - 1);
        }

        if (key) {
            result.push({ key, value });
        }
    });

    return result;
};

/**
 * Generates a .env file content string from an array of variables
 * @param {Array<{key: string, value: string}>} variables 
 * @returns {string}
 */
export const generateEnvContent = (variables) => {
    return variables
        .map(v => `${v.key}=${v.value}`)
        .join('\n');
};

/**
 * Triggers a file download in the browser
 * @param {string} content - Content of the file
 * @param {string} filename - Name of the file
 */
export const downloadFile = (content, filename) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};
