import { getFirestore } from '@firebase/firestore'
import firebaseApp from '../firebaseApp'

export default () => getFirestore(firebaseApp)
