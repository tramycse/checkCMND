
export const addImage = (data) => {
  return dispatch => {
    dispatch(setSpinner())
    fetch('https://us-central1-cmnd1-ce6e6.cloudfunctions.net/storeImage', {
      method: "POST", 
      body: JSON.stringify({
        imageId: data.base64
      })
    })
    .catch(err => console.log('the error', err))
    .then(res => {
        return res.json()
    })
    .then(parsedRes => {
      // console.log(parsedRes)
      const imageData = {
        imageName: 'No image name',
        imageUrl: parsedRes.imageUrl,
        imagePath: parsedRes.imagePath
      }
      return fetch('https://cmnd1-ce6e6.firebaseio.com/images.json', {
        method: 'POST',
        body: JSON.stringify(imageData)
      })
    })
    .then(res => res.json())
    .then(parsedRes => {
        dispatch(imageIsAdded())
        return parsedRes
    })
    .catch(err => console(err))
  }
}

const imageIsAdded = () => {
  return {
    type: 'ADD_IMAGE',
  }
}

export const setSpinner = () => {
  return {
    type: 'SET_SPINNER',
  }
}

export const setImageAddedHandlerToFalse = () => {
  return {
    type: 'SET_SPINNER_TO_FALSE',
  }
}

export const getImageHandler = () => {
  return dispatch => {
    fetch('https://cmnd1-ce6e6.firebaseio.com/images.json')
    .catch(err => console.log(err))
    .then(res => {
      return res.json()
    })
    .then(parsedRes => {
      const imageList = Object.keys(parsedRes).map(key  => {
        return {
          imageId: key,
          name: parsedRes[key].imageName,
          url: parsedRes[key].imageUrl,
          path: parsedRes[key].imagePath
        }
      })
      dispatch(getImage(imageList))
    })
  }
}

const getImage = (imageList) => {
  return {
    type: 'GET_IMAGE',
    payload: imageList
  }
}

export const changeImageName = (id, name) => {
  
  return dispatch => {
    fetch('https://cmnd1-ce6e6.firebaseio.com/images/'+ id +'/imageName' +'.json/', {
      method: "PUT",
      body: JSON.stringify(name)
    })
    .catch(err=> console.log(err))
    .then(res => {return res.json()})
    .then(parsedRes => {
      dispatch(getImageHandler())
    })
    
  }
}

export const deleteImage = (imageId) => {
  return dispatch => {
    fetch('https://cmnd1-ce6e6.firebaseio.com/images/' + imageId + '.json/', {
      method: 'DELETE'
    })
    .catch(err=> console.log(err))
      .then(res => {return res.json()})
      .then(parsedRes => {
        // console.log('parsed', parsedRes)
        dispatch(getImageHandler())
      }
    )
  }
}