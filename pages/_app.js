import '../styles/globals.css'
import Head from 'next/head'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { getAuth } from 'firebase/auth'
import Layout from '../components/Layout'

const theme = createTheme({
  palette: {
    primary: {
      main: '#BFA2DB',
      contrastText: '#132f4c',
    },
    secondary: {
      main: '#132f4c',
    },
  },
})

const firebaseConfig = {
  apiKey: 'AIzaSyBzYU69CYWMVmDkXuoZkIhRuGjMti1XVBQ',
  authDomain: 'newinstagram-c0dc9.firebaseapp.com',
  projectId: 'newinstagram-c0dc9',
  storageBucket: 'newinstagram-c0dc9.appspot.com',
  messagingSenderId: '1079000555402',
  appId: '1:1079000555402:web:96260fe5122bddcc10f273',
}

// const App = ({ children }) => {
//   const authInstanse = getAuth(useFirebaseApp())
//   return <AuthProvider sdk={authInstanse}>{children}</AuthProvider>
// }

// eslint-disable-next-line react/prop-types
function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Newinstagram</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  )
}

export default MyApp
