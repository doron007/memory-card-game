import Head from 'next/head'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Memory Card Game</title>
        <meta name="description" content="A fun memory card game built with Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="text-4xl font-bold text-blue-600">Welcome to My Awesome Memory Card Game</h1>
      </main>
    </div>
  )
}