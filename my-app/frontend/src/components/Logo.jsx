import { siteConfig } from '../siteConfig'

export function Logo({ compact = false }) {
  return (
    <div className="logoMark" aria-label={siteConfig.companyName}>
       <img
        src="/logo.png"
        alt={siteConfig.companyName}
        style={{ height: compact ? '40px' : '48px', width: 'auto', objectFit: 'contain' }}
      />
      {!compact && (
        <div className="logoText">
          <div className="logoTitle">{siteConfig.companyName}</div>
          <div className="logoSubtitle">{siteConfig.tagline}</div>
        </div>
      )}
    </div>
  )
}


