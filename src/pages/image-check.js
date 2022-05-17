import { useState } from "react";
import * as tf from "@tensorflow/tfjs";


export function ImageCheck() {

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(undefined);

   /**
 * Display the result in the page
 */
    function displayDescription(predictions) {
      // Sort by probability
      const result = predictions.sort((a, b) => a > b)[0];
  
      if (result.probability > 0.2) {
        const probability = Math.round(result.probability * 100);
  
        // Display result
        description.innerText = `${probability}% shure this is a ${result.className.replace(',', ' or')} 🐶`;
      } else description.innerText = 'I am not shure what I should recognize 😢';
    }
  
    /**
     * Classify with the image with the mobilenet model
     */
    async function classifyImage(img) {
      const model = await tf.loadLayersModel('https://localhost:3000/model/model.json');

      model.classify(img).then((predictions) => {
        displayDescription(predictions);
      });
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

      classifyImage(e.target.files[0]);
    }
  
    
  console.log("image", image)
  return (
    <main>
      <div className="loader">
        <h2>Loading ...</h2>
      </div>

      <section className="image-section">
        <img src={preview} id="image" />
        <div className="image-prediction" id="prediction"></div>
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