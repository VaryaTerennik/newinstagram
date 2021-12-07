import {
  Button,
  Container,
  TextField,
  Typography,
  Card,
  CardContent,
  Alert,
  AlertTitle,
} from '@mui/material'
import React, { useState } from 'react'
import Link from 'next/link'
import AccountCircle from '@mui/icons-material/AccountCircle'
import { useForm } from 'react-hook-form'
import { signInWithEmailAndPassword, signOut, getAuth } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import firebaseApp from '../../firebaseApp'
import style from './Register.module.css'

const auth = getAuth(firebaseApp)

function RegisterPage() {
  const { register, handleSubmit } = useForm()
  const [user, loading, error] = useAuthState(auth)
  const isLoggedin = !loading && user
  console.log(user)
  const [errorCodes, setErrorCode] = useState([])

  const onSubmit = (data) => {
    signInWithEmailAndPassword(auth, data.email, data.password).catch(
      (error) => {
        const errorCode = error.code
        setErrorCode(errorCode)
      }
    )
  }

  console.log(`Произошла ошибка ${errorCodes}`)

  const handleSignOut = () => {
    signOut(auth)
  }

  return (
    <Container
      sx={{ bgcolor: '#F3F1F5', minHeight: '100vh', position: 'absolute' }}
      className={style.totalContainer}
    >
      <Card className={style.registercard}>
        <CardContent className={style.registerform}>
          <Typography className={style.title} variant="h2" component="h1">
            Авторизация
          </Typography>
          {errorCodes === 'auth/invalid-email' && !user && (
            <Alert severity="error" className={style.alerterror}>
              Неверный логин или пароль
            </Alert>
          )}
          {errorCodes === 'auth/wrong-password' && !user && (
            <Alert severity="error" className={style.alerterror}>
              Неверный пароль
            </Alert>
          )}
          {errorCodes === 'auth/too-many-requests' && !user && (
            <Alert severity="error" className={style.alerterror}>
              Вы исчерпали количество попыток. Повторите запрос позже
            </Alert>
          )}
          {errorCodes === 'auth/user-not-found' && !user && (
            <Alert severity="error" className={style.alerterror}>
              Пользователь с таким логином не найден
            </Alert>
          )}
          {!isLoggedin && (
            <form
              className={style.registerform}
              onSubmit={handleSubmit(onSubmit)}
            >
              <TextField
                className={style.textInput}
                placeholder="Email"
                type="email"
                label="Email"
                variant="outlined"
                {...register('email')}
              />
              <TextField
                className={style.textInput}
                placeholder="Пароль"
                label="Пароль"
                variant="outlined"
                {...register('password')}
              />
              <Button type="submit" size="large" variant="contained">
                Вход
              </Button>
            </form>
          )}
          {isLoggedin && (
            <Container className={style.registerform}>
              <Alert severity="success" className={style.alertsuccess}>
                <AlertTitle>Вход выполнен</AlertTitle>
                Вы успешно вошли как <strong>{user.email}</strong>
              </Alert>
              <Button
                color="secondary"
                size="large"
                variant="contained"
                onClick={handleSignOut}
              >
                Выход
              </Button>
            </Container>
          )}
        </CardContent>
      </Card>
      <Card sx={{ width: '600px', m: 'auto', mb: '20px' }}>
        <CardContent
          sx={{
            display: 'flex',
            flexWrap: 'nowrap',
            flexDirection: 'row',
            m: 'auto',
          }}
        >
          <Typography
            sx={{ width: '40%', mt: 'auto', mb: 'auto', ml: '43px' }}
            variant="h6"
            component="h2"
          >
            Еще нет аккаунта?
          </Typography>
          <Link href="/auth/register" sx={{ mr: '2' }}>
            <Button
              sx={{ ml: '0px', width: '45%' }}
              size="large"
              variant="outlined"
              color="secondary"
            >
              <AccountCircle sx={{ mr: '10px' }} />
              Регистрация
            </Button>
          </Link>
        </CardContent>
      </Card>
    </Container>
  )
}

export default RegisterPage
