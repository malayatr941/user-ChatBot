import {storage} from '../DB/firebase'
import {ref,uploadBytes,getDownloadURL, StorageReference} from 'firebase/storage'
import {v4} from 'uuid';

class FireBaseHelper {
public image:any;

 constructor(){
  this.image = null;
 }

 setUrl = async(path:StorageReference)=>{
  const Imageref = ref(storage,`${path}`)
  await getDownloadURL(Imageref).then((x)=>{
      console.log(x);
  })
}

 setImageUpload =(e:any)=>{
      const reader = new FileReader();           // babel javascript class
      reader.onloadend = () => {
      }
      reader.readAsDataURL(e.target.files[0]);
      this.image = (e.target.files[0])
 }

  uploadImage = async ()=>{
    const imageRef = ref(storage, `image/${this.image.name + v4()}`)
    uploadBytes(imageRef,this.image).then(async (res)=>{
       console.log(res.ref)
    })
}
}

export default FireBaseHelper;