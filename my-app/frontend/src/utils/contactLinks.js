export function toWhatsAppLink({ whatsappE164, message }) {
  const number = String(whatsappE164 || '').replace(/[^\d+]/g, '')
  const text = encodeURIComponent(message || '')
  // wa.me expects countrycode + number with no plus
  const waNumber = number.replace(/^\+/, '')
  return `https://wa.me/${waNumber}?text=${text}`
}

export function toMailtoLink({ email, subject, body }) {
  const s = encodeURIComponent(subject || '')
  const b = encodeURIComponent(body || '')
  return `mailto:${email}?subject=${s}&body=${b}`
}


