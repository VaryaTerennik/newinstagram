import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { styled } from '@mui/material/styles'
import CircularProgress from '@mui/material/CircularProgress'
import {
  Button,
  Container,
  TextField,
  Typography,
  Card,
  CardContent,
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import Stack from '@mui/material/Stack'

import { useCollectionData } from 'react-firebase-hooks/firestore'
import {
  serverTimestamp,
  getFirestore,
  collection,
  addDoc,
} from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useRouter } from 'next/router'
import style from '../auth/Register.module.css'
import firebaseApp from '../../firebaseApp'

const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)

const createPost = () => {
  const router = useRouter()
  const Input = styled('input')({
    display: 'none',
  })
  const { register, handleSubmit, formState, setValue } = useForm({
    mode: 'onChange',
  })
  const postCollection = collection(db, 'posts')
  const [posts, loading] = useCollectionData(postCollection)
  console.log(posts)
  const [user] = useAuthState(auth)
  const storage = getStorage(firebaseApp)

  useEffect(() => {
    register('imageUrl', {
      required: 'Пожалуйста, загрузите картинку',
    })
  }, [])

  const [loadingProgress, setLoadingProgress] = useState(false)

  const onFormSubmit = async (data) => {
    const { id } = await addDoc(postCollection, {
      uid: user.uid,
      createdAt: serverTimestamp(),
      text: data.text,
      imageUrl: data.imageUrl,
    })

    router.push(`/posts/${id}`)
  }

  const handleUploadFile = async (event) => {
    try {
      setLoadingProgress(true)
      const file = event.target.files[0]
      const storageRef = ref(storage, `images/${file.name}`)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      setValue('imageUrl', url)
      console.log(url)
    } finally {
      setLoadingProgress(false)
    }
  }

  return (
    <Container
      sx={{ bgcolor: '#F3F1F5', height: '100vh', position: 'absolute' }}
      className={style.totalContainer}
    >
      <Card className={style.registercard}>
        <CardContent className={style.registerform}>
          <Typography className={style.title} variant="h2" component="h1">
            Новый пост
          </Typography>
          <form
            className={style.registerform}
            onSubmit={handleSubmit(onFormSubmit)}
          >
            <TextField
              className={style.textInput}
              multiline
              maxRows={4}
              type="text"
              label="Введите описание поста"
              variant="outlined"
              {...register('text', {
                required: 'Пожалуйста, введите описание',
              })}
            />
            <Stack direction="row" alignItems="center" spacing={2}>
              <label htmlFor="contained-button-file">
                <Input
                  accept="image/*"
                  id="contained-button-file"
                  type="file"
                  onChange={handleUploadFile}
                />
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                >
                  {!loadingProgress && <PhotoCamera />}
                  {loadingProgress && <CircularProgress />}
                </IconButton>
              </label>
              <Button
                disabled={!formState.isValid}
                sx={{ width: '100%' }}
                type="submit"
                size="large"
                variant="contained"
              >
                Создать пост
              </Button>
            </Stack>
            {/* <Input
              accept="image/*"
              id="contained-button-file"
              multiple
              type="file"
              onChange={handleUploadFile}
            /> */}
          </form>
        </CardContent>
      </Card>
    </Container>
  )
}

export default createPost
