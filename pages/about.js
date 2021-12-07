import Head from 'next/head'
import Link from 'next/link'

function AboutPage() {
    return (
        <main>
            <Head>
                <title>About company</title>
            </Head>
            <h1>
                О компании
            </h1>
            <Link href="/">Home page</Link>
        </main>
    )
}

export default AboutPage

