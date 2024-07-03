const randomHexColorCode = () => {
    // Generate a brighter color by ensuring each RGB component is above a certain threshold
    const minBrightness = 100; // Adjust this value (0-255) to avoid darker colors
    const r = Math.floor(Math.random() * (256 - minBrightness) + minBrightness).toString(16).padStart(2, '0');
    const g = Math.floor(Math.random() * (256 - minBrightness) + minBrightness).toString(16).padStart(2, '0');
    const b = Math.floor(Math.random() * (256 - minBrightness) + minBrightness).toString(16).padStart(2, '0');

    const hexColor = `#${r}${g}${b}`;
    return hexColor;
};

export { randomHexColorCode };