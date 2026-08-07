import Link from 'next/link'

export function Navbar() {
    return (
        <header className="navbar">
            <div className="navbar__inner">
                <Link href="/blog" className="navbar__logo" aria-label="Payload Blog — go to home">

                    <span className="navbar__logo-text"><b>Byteshifted Payload Blog</b></span>
                </Link>

                <nav className="navbar__nav" aria-label="Main navigation">

                    <Link href="/admin" className="navbar__link navbar__link--admin">
                        Admin <span aria-hidden="true">↗</span>
                    </Link>
                </nav>
            </div>
        </header>
    )
}
