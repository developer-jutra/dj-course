// Simulate API delay
export const delay = (min: number, max = min) => {
    const ms = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, ms))
}

export const MOCK_MODE = true
