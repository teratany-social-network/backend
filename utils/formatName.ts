export default function formatName(str: string): string {
    // Supprime les espaces qui se suivent en ne laissant qu'un
    str = str.replace(/\s+/g, ' ')

    // Supprime les espaces au début et à la fin de la chaîne
    str = str.trim()

    // Met toutes les lettres en minuscule
    str = str.toLowerCase()

    // Met la première lettre d'un mot en majuscule
    str = str.replace(/\b\w/g, (c) => c.toUpperCase())

    return str
}