import {
  Button,
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
} from '@mui/material'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { doc, deleteDoc, updateDoc } from 'firebase/firestore'
import Link from 'next/link'
import FavoriteBorderTwoToneIcon from '@mui/icons-material/FavoriteBorderTwoTone'
import FavoriteIcon from '@mui/icons-material/Favorite'
import EditIcon from '@mui/icons-material/Edit'
import CommentIcon from '@mui/icons-material/Comment'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'
import getAppFirestore from '../utils/getAppFirestore'
import firebaseApp from '../firebaseApp'

const db = getAppFirestore()
const auth = getAuth(firebaseApp)

const Post = ({ post }) => {
  const router = useRouter()
  const postUserDoc = doc(db, 'users', post.uid)
  const [postUser] = useDocumentData(postUserDoc)
  const [user] = useAuthState(auth)

  const uid = user?.uid
  const likes = post.likes || {}
  const isLike = likes[uid]
  const likesCount = Object.keys(likes).length

  console.log(likesCount)

  const handleDeletePost = (post) => {
    const postDoc = doc(db, 'posts', post.id)
    deleteDoc(postDoc)
  }

  const handleLike = () => {
    if (!uid) {
      router.push('/auth/login')
      return
    }
    const postDoc = doc(db, 'posts', post.id)
    if (isLike) {
      delete likes[uid]
    } else {
      likes[uid] = true
    }
    updateDoc(postDoc, { likes })
    console.log(post.likes)
  }

  return (
    <Card
      sx={{
        mt: '5px',
        mb: '5px',
        width: '100%',
        height: '700px',
        padding: '0px',
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        {postUser && (
          <Box sx={{ width: '100%' }}>
            <Link href={`/users/${post.uid}`} sx={{ mr: '2' }}>
              <Typography color="primary" variant="h6" component="div">
                {postUser.username}
              </Typography>
            </Link>
            {post.createdAt && (
              <Typography
                sx={{ color: '#132f4c' }}
                variant="caption"
                component="div"
              >
                {new Date(post.createdAt.seconds * 1000).toLocaleDateString()}
              </Typography>
            )}
            <Typography sx={{ color: '#132f4c' }} variant="p" component="div">
              {post.text ? post.text : ''}
            </Typography>
          </Box>
        )}
        <Box sx={{ width: '100%' }}>
          <Box
            sx={{
              textAlign: 'center',
              m: ' auto ',
              maxWidth: '520px',
              maxHeight: '520px',
            }}
          >
            <Link href={`/posts/${post.id}`} sx={{ mr: '2' }}>
              <img margin="auto" width="90%" src={post.imageUrl} />
            </Link>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            height: '70px',
          }}
        >
          <Box
            sx={{
              width: '100px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            {!isLike && (
              <IconButton color="primary" onClick={handleLike}>
                <FavoriteBorderTwoToneIcon />
                {likesCount || '0'}
              </IconButton>
            )}

            {isLike && (
              <IconButton color="primary" onClick={handleLike}>
                <FavoriteIcon />
                {likesCount || '0'}
              </IconButton>
            )}
            <Link href={`/posts/${post.id}`}>
              <IconButton color="primary">
                <CommentIcon /> {post.commentsCount ? post.commentsCount : '0'}
              </IconButton>
            </Link>
          </Box>
          {uid === post.uid && (
            <>
              <Button
                sx={{ width: '200px', mt: '10px', mb: '20px' }}
                variant="outlined"
                onClick={() => handleDeletePost(post)}
                // Почему так?
              >
                Удалить пост
              </Button>
              <Link href={`/posts/updatepost/${post.id}`}>
                <IconButton
                  sx={{ width: '10px', mt: '10px', mb: '20px' }}
                  variant="outlined"
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
              </Link>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default Post
