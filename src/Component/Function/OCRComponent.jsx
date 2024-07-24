import { useState } from 'react';
import axios from 'axios';
import { Input, Button, Spinner } from '@chakra-ui/react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { API_KEY } from '../../config';

function App({
  image,
  setImage,
  setOcrResult,
  onCloseScanItem,
  setSelectedImage,
  setPrompt,
  prompt,
  loading,
  setLoading,
  selectedFile,
  setSelectedFile,
  transactionOrder,
  setTransactionOrder
}) {
  const [apiData, setApiData] = useState([]);
  const genAI = new GoogleGenerativeAI(API_KEY);

  const handleFileChange = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    setSelectedFile(file);
    const fileURL = URL.createObjectURL(file);
    setImage(fileURL);
    setSelectedImage(fileURL);
  };

  const handleSubmit = async (event) => {
    sessionStorage.clear();
    event.preventDefault();
    setLoading(true);
  
    if (!selectedFile) {
      console.error('No file selected.');
      setLoading(false);
      return;
    }
  
    const formData = new FormData();
    formData.append('apikey', 'K88300698988957');
    formData.append('language', 'eng');
    formData.append('isOverlayRequired', 'false');
    formData.append('file', selectedFile);
    formData.append('OCREngine', 2);
    formData.append('detectOrientation', 'true');
    formData.append('isTable', 'true');
    formData.append('scale', 'true');
  
    try {
      const ocrResponse = await axios.post('https://api.ocr.space/parse/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      const parsedResult = ocrResponse.data.ParsedResults?.[0];
      if (parsedResult) {
        const parsedText = parsedResult.ParsedText || '';
        setOcrResult(parsedText);
        const textOverlayLines = parsedResult.TextOverlay?.Lines;
        setPrompt(JSON.stringify(textOverlayLines));
  
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const promptget = `
          Your job is to process and make conclusion abou json that we sent,
          it is a bill info, make
          array item info about what is the 
          item price, item name, item quantity, disc or discount as discount, 
          total bo;;, total price from quantity times item price then reduced by discount
          and also 
          array named company info about company name, company address
          and also
          array named bill-information about total price
          etc from this json,
          format is yyyy-mm-dd without time stamp or hour and replace dpt '.' with '-' line dash,
          and make sure the result is an array of object and excluding symbol '
          and exclude symbol aphostropes from start and end of string to avoid as string error,
          just pure array of object
          example : 
          {
            "company-information": [
                {
                    "company-name": "",
                    "company-address": ""
                }
            ],
            "item-information": [
                {
                    "item-name": "",
                    "item-price": "",
                    "item-discount": "",
                    "item-quantity": "",
                    "item-totalprice": ""
                }
            ],
            "bill-information": [
                {
                    "total-price": "",
                    "bill-date": "",
                    "bill-type": "",
                    "total-discount": "" // corrected "total-diskon" to "total-discount"
                }
            ]
        }
          my data :
          ${JSON.stringify(textOverlayLines)}
        `;
  
        const aiResponse = await model.generateContent(promptget);
        const text = await aiResponse.response.text();
  
        // Attempt to parse the AI response as JSON
        let sessionData;
        try {
          sessionData = JSON.parse(text.replace(/'/g, ' '));
        } catch (jsonError) {
          console.error('Error parsing AI response as JSON:', jsonError);
          // Handle the error (e.g., show a message to the user)
          setLoading(false);
          onCloseScanItem();
          setImage('');
          return;
        }
  
        // Validate the structure of sessionData
        if (!sessionData['company-information'] || !sessionData['item-information'] || !sessionData['bill-information']) {
          console.error('Invalid AI response format:', sessionData);
          // Handle the error (e.g., show a message to the user)
          setLoading(false);
          onCloseScanItem();
          setImage('');
          return;
        }
  
        const newTransactionOrder = {
          ...transactionOrder,
          'company-information': sessionData['company-information'],
          'item-information': [
            ...transactionOrder['item-information'],
            ...sessionData['item-information']
          ],
          'bill-information': sessionData['bill-information']
        };
  
        setTransactionOrder(newTransactionOrder);
        sessionStorage.setItem('sessionData', JSON.stringify(sessionData));
        setApiData(text);
  
        console.log("AI Response:", text);
        console.log("AI Result:", sessionData);
      }
    } catch (error) {
      console.error('Error processing OCR or generative AI request:', error);
    } finally {
      setLoading(false);
      onCloseScanItem();
      setImage('');
    }
  };



  return (
    <div>
      {loading ? (
        <div className='col-12 d-flex justify-content-center align-items-center py-5 px-5'>
          <Spinner />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <Input  colorScheme="teal" className='pt-1' type='file' onChange={handleFileChange} />
          {image && (
            <div>
              <div className='col-12'>
                <Button type='submit' className='ms-3 px-4 mb-3' colorScheme="teal" size="sm">
                  Auto Fill to Table
                </Button>
              </div>
              <div className='col-12 d-flex justify-content-center'>
                <img src={image} alt="uploaded" style={{ width: '300px' }} />
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
}

export default App;
