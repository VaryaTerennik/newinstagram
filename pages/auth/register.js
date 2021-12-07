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
import AccountCircle from '@mui/icons-material/AccountCircle'
import React from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getFirestore, setDoc, doc } from 'firebase/firestore'
import style from './Register.module.css'
import firebaseApp from '../../firebaseApp'

const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)

function RegisterPage() {
  const { register, handleSubmit } = useForm()
  const [user, loading, error] = useAuthState(auth)
  const isLoggedin = !loading && user

  const onSubmit = async (data) => {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    )

    const { uid } = userCredentials.user
    const userDoc = doc(db, 'users', uid)
    console.log(userDoc)

    setDoc(userDoc, {
      username: data.displayName,
      fullname: data.namesurname,
    })
  }

  return (
    <Container
      sx={{
        bgcolor: '#F3F1F5',
        minHeight: '100vh',
        position: 'absolute',
        minWidth: '100%',
      }}
      className={style.totalContainer}
    >
      <Card className={style.registercard}>
        <CardContent className={style.registerform}>
          <Typography className={style.title} variant="h2" component="h1">
            Регистрация
          </Typography>
          <form
            className={style.registerform}
            onSubmit={handleSubmit(onSubmit)}
          >
            {isLoggedin && (
              <Alert severity="success" className={style.alertsuccess}>
                <AlertTitle>Вход выполнен</AlertTitle>
                Вы успешно вошли как <strong>{user.email}</strong>
              </Alert>
            )}
            <TextField
              className={style.textInput}
              placeholder="Email"
              type="email"
              id="filled-basic"
              label="Email"
              variant="outlined"
              {...register('email')}
            />
            <TextField
              className={style.textInput}
              placeholder="Имя и Фамилия"
              id="filled-basic"
              label="Имя и Фамилия"
              variant="outlined"
              type="text"
              {...register('namesurname')}
            />
            <TextField
              className={style.textInput}
              placeholder="Имя пользователя"
              id="filled-basic"
              label="Имя пользователя"
              variant="outlined"
              type="text"
              {...register('displayName')}
            />
            <TextField
              className={style.textInput}
              placeholder="Пароль"
              id="filled-basic"
              label="Пароль"
              variant="outlined"
              type="password"
              {...register('password')}
            />
            <Button type="submit" size="large" variant="contained">
              Регистрация
            </Button>
          </form>
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
            variant="h5"
            component="h2"
          >
            Уже есть аккаунт?
          </Typography>
          <Link href="/auth/login" sx={{ mr: '2' }}>
            <Button
              sx={{ ml: '0px', width: '45%' }}
              size="large"
              variant="outlined"
              color="secondary"
            >
              <AccountCircle sx={{ mr: '10px' }} />
              Войти
            </Button>
          </Link>
        </CardContent>
      </Card>
    </Container>
  )
}

export default RegisterPage
