import Head from 'next/head'
import { useForm } from 'react-hook-form'
import { styled } from '@mui/material/styles'
import CircularProgress from '@mui/material/CircularProgress'
import { Button, Container, TextField, Box, Card } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import Stack from '@mui/material/Stack'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import firebaseApp from '../../../firebaseApp'

import style from '../../auth/Register.module.css'

import getAppFirestore from '../../../utils/getAppFirestore'

const db = getAppFirestore()

function UpdatePost() {
  const router = useRouter()
  const postId = String(router.query.id)
  const Input = styled('input')({
    display: 'none',
  })
  const { register, handleSubmit, setValue, getValues } = useForm({
    mode: 'onChange',
  })

  const postDoc = doc(db, 'posts', postId)
  const [post, loading] = useDocumentData(postDoc, { idField: 'id' })
  const storage = getStorage(firebaseApp)

  const [loadingProgress, setLoadingProgress] = useState(false)

  const onFormSubmit = async (data) => {
    if (data.imageUrl) {
      await updateDoc(postDoc, {
        createdAt: serverTimestamp(),
        text: data.text,
        imageUrl: data.imageUrl,
      })
    } else {
      await updateDoc(postDoc, {
        createdAt: serverTimestamp(),
        text: data.text,
        imageUrl: post.imageUrl,
      })
    }
    router.push(`/posts/${postId}`)
  }

  useEffect(() => {
    register('imageUrl')
    register('text')
  }, [])

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
      sx={{
        bgcolor: '#F3F1F5',
        minWidth: '100%',
        position: 'absolute',
        minHeight: '100vh',
      }}
    >
      <Card sx={{ m: '20px auto', width: '60%', minHeight: '100vh' }}>
        <Head>
          <title>About company</title>
        </Head>
        <Box
          sx={{
            mt: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {loading && <p>Загрузка</p>}
          {!loading && post && (
            <form onSubmit={handleSubmit(onFormSubmit)}>
              {/* {!getValues('text') && <Box>{post.text}</Box>}
              {getValues('text') && <Box>{getValues('text')}</Box>} */}
              <Box
                sx={{
                  width: '70%',
                  m: 'auto',
                }}
              >
                <TextField
                  sx={{ width: '100%', m: 'auto' }}
                  className={style.textInput}
                  multiline
                  maxRows={4}
                  type="text"
                  label="Редактировать описание поста"
                  defaultValue={post.text}
                  variant="outlined"
                  {...register('text')}
                />
              </Box>
              {!getValues('imageUrl') && (
                <Box
                  sx={{
                    minWidth: '520px',
                    minHeight: '520px',
                    maxWidth: '620px',
                    maxHeight: '620px',
                    m: 'auto',
                  }}
                >
                  <img margin="auto" width="100%" src={post.imageUrl} alt="" />
                </Box>
              )}
              {getValues('imageUrl') && (
                <Box
                  sx={{
                    minWidth: '520px',
                    minHeight: '520px',
                    maxWidth: '620px',
                    maxHeight: '620px',
                    m: 'auto',
                  }}
                >
                  <img
                    margin="auto"
                    width="100%"
                    src={getValues('imageUrl')}
                    alt=""
                  />
                </Box>
              )}
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ width: '620px', m: '20px auto' }}
              >
                <Box
                  sx={{
                    width: '100%',
                    m: 'auto',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}
                >
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
                    sx={{ width: '70%', m: 'auto' }}
                    type="submit"
                    size="large"
                    variant="contained"
                  >
                    Сохранить пост
                  </Button>
                </Box>
              </Stack>
            </form>
          )}
        </Box>
      </Card>
    </Container>
  )
}

export default UpdatePost
