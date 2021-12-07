import Head from 'next/head'
import { Button, Box, Grid, Typography, Container } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
  useCollectionData,
  useDocumentData,
} from 'react-firebase-hooks/firestore'
import { collection, query, orderBy, where, doc } from 'firebase/firestore'
import Post from '../../components/Post'
import getAppFirestore from '../../utils/getAppFirestore'

const db = getAppFirestore()

function UserPage() {
  const router = useRouter()
  const uid = String(router.query.id)
  const postCollection = collection(db, 'posts')
  const queryPosts = query(postCollection, where('uid', '==', uid))
  const [posts, loading] = useCollectionData(queryPosts, { idField: 'id' })
  console.log(posts)

  const userDoc = doc(db, 'users', uid)
  const [user, userLoading] = useDocumentData(userDoc, { idField: 'id' })
  console.log(user)

  return (
    <Container
      sx={{
        minWidth: '100%',
        m: '0px',
        backgroundColor: '#F3F1F5',
        minHeight: '100vh',
      }}
    >
      <Head>
        <title>About company</title>
      </Head>
      {userLoading && (
        <Typography variant="h5" component="h3" sx={{ textAlign: 'center' }}>
          Пользователь: Загрузка...
        </Typography>
      )}
      {!userLoading && user && (
        <Typography variant="h5" component="h3" sx={{ textAlign: 'center' }}>
          Пользователь: {user.username}
        </Typography>
      )}
      <Grid
        container
        spacing={3}
        sx={{ width: '100%', mr: '0px', ml: '0px', mt: '0px' }}
      >
        {posts &&
          posts.map((post) => (
            <Grid item xs={4}>
              <Post key={post.id} post={post} />
            </Grid>
          ))}
      </Grid>
    </Container>
  )
}

export default UserPage
