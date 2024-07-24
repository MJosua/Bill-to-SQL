import { Button } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Tesseract from 'tesseract.js';

const BillScanner = () => {
    const [image, setImage] = useState(null);
    const [recognizedText, setRecognizedText] = useState('');
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [dates, setDates] = useState([]);
    const [titles, setTitle] = useState('');

    const handleImageChange = (e) => {
        setImage(URL.createObjectURL(e.target.files[0]));
    };

    const applyPreprocessing = (imageSrc, preprocessFn) => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.onload = function () {
                canvas.width = img.width;
                canvas.height = img.height;
                preprocessFn(canvas, ctx, img);
                resolve(canvas.toDataURL('image/jpeg'));
            };
            img.src = imageSrc;
        });
    };

    const preprocessGrayscale = (canvas, ctx, img) => {
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg;
            data[i + 1] = avg;
            data[i + 2] = avg;
        }
        ctx.putImageData(imageData, 0, 0);
    };

    const preprocessBinaryThreshold = (canvas, ctx, img, threshold = 128) => {
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            const binary = avg < threshold ? 0 : 255;
            data[i] = binary;
            data[i + 1] = binary;
            data[i + 2] = binary;
        }
        ctx.putImageData(imageData, 0, 0);
    };

    const preprocessContrast = (canvas, ctx, img, contrast = 150) => {
        ctx.filter = `contrast(${contrast}%)`;
        ctx.drawImage(img, 0, 0);
    };

    const preprocessEnhanceNumbers = (canvas, ctx, img) => {
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            // Enhance contrast of digits to make them clearer
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            const binary = avg < 128 ? 0 : 255;
            data[i] = binary;
            data[i + 1] = binary;
            data[i + 2] = binary;
        }
        ctx.putImageData(imageData, 0, 0);
    };

    const handleTextRecognition = async () => {
        setLoading(true);

        const preprocessingMethods = [
            preprocessEnhanceNumbers,


        ];

        const preprocessedImages = await Promise.all(
            preprocessingMethods.map((preprocess) =>
                applyPreprocessing(image, preprocess)
            )
        );

        const ocrResults = await Promise.all(
            preprocessedImages.map((preprocessedImage) =>
                Tesseract.recognize(preprocessedImage, 'eng', { logger: (m) => console.log(m) })
            )
        );

        const allTextResults = ocrResults.map(result => result.data.text.split('\n'));
        const combinedText = combineResults(allTextResults);

        setRecognizedText(combinedText.join('\n'));
        parseText(combinedText.join('\n'));
        setLoading(false);
    };

    const combineResults = (results) => {
        const maxLength = Math.max(...results.map(lines => lines.length));
        const combinedLines = [];

        for (let i = 0; i < maxLength; i++) {
            const linesAtIndex = results.map(lines => lines[i] || '');
            combinedLines.push(selectBestLine(linesAtIndex));
        }

        return combinedLines;
    };

    const selectBestLine = (lines) => {
        return lines.reduce((bestLine, currentLine) => {
            const bestLineNonAlnumCount = (bestLine.match(/[^a-zA-Z0-9\s]/g) || []).length;
            const currentLineNonAlnumCount = (currentLine.match(/[^a-zA-Z0-9\s]/g) || []).length;
            return currentLineNonAlnumCount < bestLineNonAlnumCount ? currentLine : bestLine;
        });
    };

    const parseText = (text) => {
        const lines = text.split('\n');
        console.log(text)
        const parsedItems = [];
        let title = '';
        let currentItem = '';
        let quantity = 1;

        const datePattern = /\b\d{1,2}[\/-]\d{1,2}[\/-](\d{2}|\d{4})\b/;

        lines.forEach((line) => {
            const matchDate = line.match(datePattern);
            if (matchDate) {
                const date = matchDate[0];
                setDates(date);
            } else if (!title && line.trim() !== '') {
                const trimmedLine = line.trim();
                title += trimmedLine + ' ';
                if (trimmedLine.includes(' ')) {
                    title = title.trim();
                }
            } else {
                const pricePattern = /\d{1,3}(,\d{3})*(\.\d{1,2})?$/;
                const match = line.match(pricePattern);
                if (match) {
                    const price = match[0];
                    const cleanPrice = price.replace(/[,.]/g, '');
                    if (cleanPrice.length >= 4) {
                        if (line.toLowerCase().includes('disc')) {
                            parsedItems.push({ item: currentItem, price: `-${price}`, quantity, title });
                        } else if (line.toLowerCase().includes('jual')) {
                          
                        } else if (line.toLowerCase().includes('tunat')) {
                          
                        } else if (line.toLowerCase().includes('purchase')) {
                          
                        }else {
                            const parts = line.split(' ');
                            const possibleQuantity = parseFloat(parts[0].replace(',', '.'));

                            if (!isNaN(possibleQuantity) && parts.length > 1) {
                                quantity = possibleQuantity;
                                currentItem = parts.slice(1, -1).join(' ');
                            } else {
                                currentItem = line.replace(pricePattern, '').trim();
                                quantity = 1;
                            }
                            parsedItems.push({ item: currentItem, price, quantity, title });
                        }
                    }
                } else {
                    if (line.trim().length > 1) {
                        currentItem = line.trim();
                    }
                }
            }
        });

        setTitle(title);
        setItems(parsedItems);
    };

    useEffect(() => {
        console.log("Items:", items);
    }, [items]);

    return (
        <div className='row'>
            <div className={(image ? "col-6" : "col-12")}>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {image && (
                    <div className='col-12 d-flex justify-content-center'>
                        <img src={image} alt="uploaded" style={{ width: '300px' }} />
                    </div>
                )}
            </div>

            {image && (
                <div className='col-6'>
                    <div>
                        <Button
                            colorScheme="teal"
                            size="sm"
                            onClick={handleTextRecognition}
                            isLoading={loading}
                        >
                            {loading ? 'Recognizing...' : 'Recognize Text'}
                        </Button>
                    </div>
                    {items.length > 0 && (
                        <>
                            {titles.length < 10 ? "" : titles}
                            <table className='table'>
                                <tbody>
                                    { !dates  ?
                                        <tr>
                                            <td colSpan={"2"}>Date</td>
                                            <td colSpan={"2"} className='text-end'>{dates}</td>
                                        </tr>
                                        :
                                        <>
                                        </>}


                                    {items.map((item, index) => (
                                        <tr
                                            key={index}
                                            className={
                                                (item.item.toLowerCase().includes('disc') ? 'table-info ' : ' ') +
                                                (item.item.toLowerCase().includes('total') ? 'table-success ' : ' ') +
                                                (index === items.length - 1 ? 'table-success' : ' ')
                                            }
                                        >
                                            <td className={item.item.toLowerCase().includes('total') || item.item.toLowerCase().includes('ppn') ? "d-none" : "1" }>{item.quantity}</td>
                                            <td colspan={item.item.toLowerCase().includes('total') || item.item.toLowerCase().includes('ppn') ? 2 : 1 }>{item.quantity !== 1 ? "x" : ""}</td>
                                            <td>{item.item}</td>
                                            <td>Rp {item.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default BillScanner;
