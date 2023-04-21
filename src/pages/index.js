import Image from 'next/image'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className={`${className.inter}`}>
      <h1>Hello, world.</h1>
    </div>
  )
}
