const LETTERS = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const filterLetters = (text: string) =>
    text.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]/g, "")

export const filterDigits = (text: string) =>
    text.replace(/[^0-9]/g, "")

export const filterDecimal = (text: string) => {
    const clean = text.replace(/[^0-9.]/g, "")
    const parts = clean.split(".")
    return parts.length > 1 ? parts[0] + "." + parts.slice(1).join("").slice(0, 2) : clean
}

export const validateRequired = (value: string, label: string): string | null =>
    value.trim() ? null : `${label} es obligatorio`

export const validateLetters = (value: string, label: string): string | null => {
    if (!value.trim()) return `${label} es obligatorio`
    if (!LETTERS.test(value)) return `${label} solo puede contener letras`
    return null
}

export const validateEmail = (value: string): string | null => {
    if (!value.trim()) return "El correo es obligatorio"
    if (!EMAIL.test(value.trim())) return "Ingresa un correo válido"
    return null
}

export const validatePassword = (value: string): string | null => {
    if (!value) return "La contraseña es obligatoria"
    if (value.length < 6) return "La contraseña debe tener al menos 6 caracteres"
    return null
}

export const validatePhone = (value: string): string | null => {
    if (!value.trim()) return "El teléfono es obligatorio"
    if (!/^[0-9]{8}$/.test(value)) return "El teléfono debe tener 8 números"
    return null
}

export const validateInteger = (value: string, label: string): string | null => {
    if (!value.trim()) return `${label} es obligatorio`
    if (!/^[0-9]+$/.test(value)) return `${label} solo puede contener números`
    return null
}

export const validateDecimal = (value: string, label: string): string | null => {
    if (!value.trim()) return `${label} es obligatorio`
    if (!/^[0-9]+(\.[0-9]{1,2})?$/.test(value)) return `${label} debe ser un número válido`
    return null
}