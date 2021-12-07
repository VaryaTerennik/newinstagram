import Head from 'next/head'
import { Button, Box, Grid, Typography, Container } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { doc } from 'firebase/firestore'
import Post from '../../components/Post'
import Comments from '../../components/Comments'

import getAppFirestore from '../../utils/getAppFirestore'

const db = getAppFirestore()

function PostPage() {
  const router = useRouter()
  const postId = String(router.query.id)

  const postDoc = doc(db, 'posts', postId)
  const [post, loading] = useDocumentData(postDoc, { idField: 'id' })

  return (
    <Box sx={{ bgcolor: '#F3F1F5', minWidth: '100%', position: 'absolute' }}>
      <Box sx={{ bgcolor: '#F3F1F5', width: '100%' }}>
        <Head>
          <title>About company</title>
        </Head>
        <Box
          sx={{
            m: '20px auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: '70%',
          }}
        >
          {loading && (
            <Box sx={{ bgcolor: '#F3F1F5', width: '100%', height: '100%' }}>
              Загрузка
            </Box>
          )}
          {!loading && post && (
            <>
              <Post post={post} />
              <Comments postId={postId} />
            </>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default PostPage
