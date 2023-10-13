const nameFormat = (text: string): string => {
    text = text.toLowerCase()
    text = text.trim()
    for (let i = 0; i < text.length; i++) {
        if (text[i] == " ") {

        }
    }
    return text
}

export { nameFormat }