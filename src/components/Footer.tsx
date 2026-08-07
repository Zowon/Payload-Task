export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__copy">
          © {year} Payload Blog
        </p>
        <p className="footer__built">
          Built with{' '}
          <a
            href="https://payloadcms.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            Payload CMS
          </a>
          {' '}&amp;{' '}
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            Next.js
          </a>
        </p>
      </div>
    </footer>
  )
}
