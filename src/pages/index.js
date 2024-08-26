import Head from 'next/head'
import Game from '@/components/game/Game'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Memory Card Game</title>
        <meta name="description" content="A fun memory card game built with Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Memory Card Game</h1>
        <Game />
      </main>
    </div>
  )
}