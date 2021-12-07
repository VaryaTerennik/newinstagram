import { useForm } from 'react-hook-form'
import { Button, TextField, Typography, Card, Box } from '@mui/material'
import {
  collection,
  query,
  orderBy,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
  updateDoc,
  increment,
} from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'
import getAppFirestore from '../utils/getAppFirestore'
import firebaseApp from '../firebaseApp'

const db = getAppFirestore()
const auth = getAuth(firebaseApp)

const Comments = ({ postId }) => {
  const { register, handleSubmit, setValue } = useForm()
  const [user] = useAuthState(auth)
  const commentsCollection = collection(db, 'posts', postId, 'comments')
  const queryComments = query(commentsCollection, orderBy('createdAt'))

  const onSubmit = async (data) => {
    const userDoc = doc(db, 'users', user.uid)
    const userSnap = await getDoc(userDoc)
    const userData = userSnap.data()
    const { username } = userData

    try {
      addDoc(commentsCollection, {
        uid: user.uid,
        username,
        createdAt: serverTimestamp(),
        text: data.text,
      })

      const postDoc = doc(db, 'posts', postId)
      updateDoc(postDoc, { commentsCount: increment(1) })

      setValue('text', '')
    } catch (error) {
      console.log(error)
    }
  }
  const [comments] = useCollectionData(queryComments, { idField: 'id' })

  return (
    <Box sx={{ minWidth: '600px', padding: '0px' }}>
      <Typography variant="h4" component="h2" sx={{ textAlign: 'center' }}>
        Комментарии
      </Typography>
      <Card sx={{ m: '10px auto', minWidth: '1000px', padding: '20px' }}>
        {comments && comments.length === 0 && (
          <Box>
            <Typography>У этого поста еще нет комментариев</Typography>
          </Box>
        )}
        {comments &&
          comments.length > 0 &&
          comments.map((comment) => (
            <Box key={comment.id}>
              {comment.createdAt && (
                <small>
                  {new Date(
                    comment.createdAt.seconds * 1000
                  ).toLocaleDateString()}
                </small>
              )}
              <small>{comment.username}</small>
              <Box>{comment.text}</Box>
            </Box>
          ))}
      </Card>
      <Box sx={{ m: '20px auto', display: 'flex', flexDirection: 'column' }}>
        <form
          margin="auto"
          width="100%"
          text-align="center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            id="outlined-multiline-static"
            multiline
            rows={3}
            sx={{
              width: '100%',
              m: '0px auto 20px',
            }}
            type="text"
            label="Напишите комментарий"
            variant="outlined"
            {...register('text')}
          />

          <Button variant="contained" type="submit">
            Отправить
          </Button>
        </form>
      </Box>
    </Box>
  )
}

export default Comments
