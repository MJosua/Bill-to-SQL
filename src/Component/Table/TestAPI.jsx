import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

function TestApi() {
    const [loading, setLoading] = useState(false);
    const [apiData, setApiData] = useState([]);
    const [prompt, setPrompt] = useState("");
    const genAI = new GoogleGenerativeAI(
        "AIzaSyCrHx20DZmDiPXrQek_hfAH-FWb2dg5tEs"
    );
    const fetchData = async () => {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const promptget = `
        make conclusion, about what is the item price, item name, company name, discount, total payment, etc from this json.
        and make the answer as json array too
        ${prompt}
        `;
        const result = await model.generateContent(promptget);
        const response = await result.response;
        const text = response.text();
        setApiData(text);
        setLoading(false);
    };

    const handleAI = (e) => {
        e.preventDefault();
        setLoading(true);
        fetchData();
    };

    return (
        <div className="container">
            <h1>Google Gemini Pro AI Integration With React</h1>
            <div className="mt-5 mb-5">
                <form onSubmit={handleAI}>
                    <div className="row d-flex align-items-end">
                        <div className="col-lg-2">
                            <label htmlFor="name" className="form-label">
                                Name
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                        </div>
                       
                        <div className="col-lg-2">
                            <button type="submit" className="btn btn-primary mt-3 col-lg-12">
                                Submit
                            </button>
                        </div>

                    </div>
                </form>
            </div>
            <div className="">
                {!loading && <p className="text-align-left">{apiData}</p>}
                {loading && <p>Loading...</p>}
            </div>
            <div className="mt-4">
                Developed By <a href="https://udarax.me">UDARAX</a>
            </div>
        </div>
    );
}

export default TestApi       