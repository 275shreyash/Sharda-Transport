import { siteConfig } from '../siteConfig'

export function Logo1({ compact = false }) {
  return (
    <div className="logoMark" aria-label={siteConfig.companyName}>
      <img
        src="/logo.png"
        alt={siteConfig.companyName}
        style={{ height: compact ? '40px' : '48px', width: 'auto', objectFit: 'contain' }}
      />
    </div>
  )
}