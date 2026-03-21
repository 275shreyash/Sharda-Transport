import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { QuickActions } from './QuickActions'

export function Layout() {
  return (
    <div className="appShell">
      <Navbar />
      <main className="main">
        <Outlet />
      </main>
      <Footer />
      <QuickActions />
    </div>
  )
}


