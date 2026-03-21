import { siteConfig } from '../siteConfig'
import { toWhatsAppLink } from '../utils/contactLinks'

export function QuickActions({ message }) {
  const wa = toWhatsAppLink({
    whatsappE164: siteConfig.whatsappE164,
    message:
      message ||
      `Hello ${siteConfig.companyName}, I want a quote for Movers & Packers / Car Rental.`,
  })

  return (
    <div className="quickActions" aria-label="Quick actions">
      {/* <a className="quickBtn quickBtnCall" href={`tel:${siteConfig.phoneE164}`}>
        Call
      </a>
      <a className="quickBtn quickBtnWhatsApp" href={wa} target="_blank" rel="noreferrer">
        WhatsApp
      </a> */}
    </div>
  )
}


