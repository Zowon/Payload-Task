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
      <body>{children}</body>
    </html>
  )
}
