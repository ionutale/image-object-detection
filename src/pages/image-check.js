import { useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from '@tensorflow-models/mobilenet'

export function ImageCheck() {

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(undefined);
  const [description, setDescription] = useState(undefined);

   /**
 * Display the result in the page
 */
    function displayDescription(predictions) {
      // Sort by probability
      const result = predictions.sort((a, b) => a > b)[0];
  
      if (result.probability > 0.2) {
        const probability = Math.round(result.probability * 100);
  
        // Display result
        setDescription(`${probability}% shure this is a ${result.className.replace(',', ' or')} 🐶`);
      } else setDescription('I am not shure what I should recognize 😢');
    }
  
    /**
     * Classify with the image with the mobilenet model
     */
    async function classifyImage(img) {
      try {
        // convert img from type File to type ImageData
      
        console.log('Classifying image...', mobilenet);
        // const model = await tf.loadLayersModel('https://raw.githubusercontent.com/ionutale/image-object-detection/main/public/model/model.json');
        const model = await mobilenet.load();
        
        const predictions = await model.classify(img)
        console.log(predictions);
        displayDescription(predictions);
        
      } catch (error) {
        console.log(error); 
      }
    }


    function onSelectFile(e) {
      if (!e.target.files || e.target.files.length === 0) {
        setImage(undefined)
        setPreview(undefined)
        return
    }

      // I've kept this example simple by using the first image instead of multiple
      setImage(e.target.files[0]);
      const objectUrl = URL.createObjectURL(e.target.files[0])
      setPreview(objectUrl)
      console.log("objectUrl", objectUrl)
      // convert objectUrl to ImageData
      const img = new Image();
      img.src = objectUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const image = tf.browser.fromPixels(imageData);
        classifyImage(image);
      }
    }
  
    
  return (
    <main>
      {description}
      <div className="loader">
        <h2>Loading ...</h2>
      </div>

      <section className="image-section">
        <img src={preview} id="image" />
        <div className="image-prediction" id="prediction">{description}</div>
      </section>

      <section className="file-section">
        <div className="file-group">
          <label htmlFor="file-input" accept="image/x-png,image/gif,image/jpeg">Upload a picture</label>
          <input type="file" id="file-input"  onChange={onSelectFile} />
          <div className="error" id="input-error">An error occured. Is your file really an image ?</div>
        </div>
      </section>
    </main>
  )
}