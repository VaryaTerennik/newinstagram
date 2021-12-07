import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material'
import AccountCircle from '@mui/icons-material/AccountCircle'
import Link from 'next/link'
import { getAuth, signOut } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import firebaseApp from '../firebaseApp'

const auth = getAuth(firebaseApp)

const Layout = ({ children }) => {
  const [user] = useAuthState(auth)

  const handleSignOut = () => {
    signOut(auth)
  }
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography
            gutterBottom
            variant="h4"
            component="h1"
            sx={{ mr: '20px', mb: '0px' }}
          >
            Newinstagram
          </Typography>
          <Link href="/posts" sx={{ mr: '2' }}>
            <Button sx={{ ml: '20px' }} size="large" color="secondary">
              Посты
            </Button>
          </Link>
          <Link href="/posts/createpost" sx={{ mr: '2' }}>
            <Button
              sx={{ ml: '20px', width: '250px' }}
              size="large"
              color="secondary"
            >
              Создать пост
            </Button>
          </Link>
          {!user && (
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <Link href="/auth/login" sx={{ mr: '2' }}>
                <Button
                  sx={{ mr: '20px' }}
                  size="large"
                  variant="outlined"
                  color="secondary"
                >
                  Войти
                </Button>
              </Link>
              <Link href="/auth/register" sx={{ mr: '2' }}>
                <Button
                  sx={{ mr: '20px' }}
                  size="large"
                  variant="outlined"
                  color="secondary"
                >
                  <AccountCircle
                    sx={{
                      mr: '10px',
                      mt: 'auto',
                      mb: 'auto',
                    }}
                  />
                  Зарестрироваться
                </Button>
              </Link>
            </Box>
          )}
          {user && (
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end',
                flexWrap: 'nowrap',
              }}
            >
              <AccountCircle
                sx={{
                  mr: '10px',
                  mt: 'auto',
                  mb: 'auto',
                  height: '100%',
                  verticalAlign: 'middle',
                }}
              />
              <Box
                sx={{
                  mr: '20px',
                  mt: 'auto',
                  mb: 'auto',
                  height: '100%',
                  verticalAlign: 'middle',
                }}
              >
                <Typography variant="subtitle2" gutterBottom component="div">
                  {user.email}
                </Typography>
              </Box>
              <Button
                sx={{ mr: '20px' }}
                size="large"
                variant="outlined"
                color="secondary"
                onClick={handleSignOut}
              >
                Выйти
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <main>{children}</main>
    </div>
  )
}

export default Layout
