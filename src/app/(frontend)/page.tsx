import { redirect } from 'next/navigation'

// No frontend pages in this project — redirect root to admin
export default function HomePage() {
  redirect('/admin')
}
