const commercialWhatsApp = '5524998164753'
export const whatsappContactUrl = (message: string) => `https://wa.me/${commercialWhatsApp}?text=${encodeURIComponent(message)}`
