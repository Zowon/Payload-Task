import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import './styles.css'

export const metadata = {
  title: {
    default: 'Blog',
    template: '%s | Blog',
  },
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="site-wrapper">
          <Navbar />
          <div className="site-content">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  )
}
