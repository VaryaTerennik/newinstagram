import {
  Button,
  Container,
  Card,
  CardContent,
  Box,
  Grid,
  Typography,
  Stack,
  Skeleton,
} from '@mui/material'
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'
import Post from '../../components/Post'
import firebaseApp from '../../firebaseApp'
import getAppFirestore from '../../utils/getAppFirestore'

const db = getAppFirestore()
const auth = getAuth(firebaseApp)

const PostPage = () => {
  const postCollection = collection(db, 'posts')
  const queryPosts = query(postCollection, orderBy('createdAt', 'desc'))
  const [posts, loading] = useCollectionData(queryPosts, { idField: 'id' })
  console.log(posts)

  const [user] = useAuthState(auth)

  // const handleAddPost = () => {
  //   addDoc(postCollection, {
  //     uid: user.id,
  //     createdAt: serverTimestamp(),
  //     text: 'Новый пост',
  //   })
  // }

  return (
    <Container
      sx={{
        mr: '0px',
        ml: '0px',
        minWidth: '100%',
        bgcolor: '#F3F1F5',
        minHeight: '100vh',
        position: 'absolute',
      }}
    >
      <Typography
        gutterBottom
        variant="h3"
        component="h1"
        sx={{ margin: 'auto', width: '100%', textAlign: 'center' }}
      >
        Посты
      </Typography>
      <Grid
        container
        spacing={3}
        sx={{
          width: '100%',
          mr: '0px',
          ml: '0px',
          mt: '0px',
          paddingTop: '0px',
        }}
      >
        {posts &&
          posts.map((post) => (
            <Grid item xs={4}>
              {loading && (
                <Stack spacing={1}>
                  <Skeleton variant="rectangular" width={520} height={700} />
                </Stack>
              )}
              {!loading && <Post key={post.id} post={post} />}
            </Grid>
          ))}
      </Grid>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          mt: '20px',
        }}
      >
        {/* <Button
          color="secondary"
          size="large"
          variant="contained"
          onClick={handleAddPost}
        >
          Добавить пост
        </Button> */}
      </Box>
    </Container>
  )
}

export default PostPage
