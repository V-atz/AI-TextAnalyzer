import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [inputText, setInputText] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const [result, setResult] = useState([]);
  const maxLength = 2500;

  //topics api
  const [topicApi, setTopicApi] = useState(false);
  const [topicHighlights, setTopicHighlights] = useState([]);
  const [topics, setTopics] = useState([]);

  //entities api
  const [entityApi, setEntityApi] = useState(false);
  const [entity, setEntity] = useState([]);

  //entailments api
  const [entailmentApi, setEntailmentApi] = useState(false);
  const [entailment, setEntailment] = useState({});

  //page api
  const [pageApi, setPageApi] = useState(false);
  const [pageHighlights, setPageHighlights] = useState([]);
  const [pageTopics, setPageTopics] = useState([]);

  // Listen for selected text from the content script
  useEffect(() => {
    chrome.runtime.onMessage.addListener((message) => {
      if (message.selectedText) {
        const limitedText = message.selectedText.slice(0, maxLength);
        setInputText(limitedText);
      }
      if (message.url) {
        console.log("URL received in React app:", message.url);
        setCurrentUrl(message.url);
      }
    });
  }, []);

  const fetchData = async (extractor) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/fetch-data",
        {
          inputText,
          extractor,
        }
      );
      console.log(response.data);

      //topics
      if (response.data.response.topics) {
        setTopicApi(true);
        setEntityApi(false);
        setEntailmentApi(false);
        setPageApi(false);
        setTopicHighlights(
          response.data.response.coarseTopics.map((topic) => ({
            label: topic.label,
            wikiLink: topic.wikiLink,
          }))
        );
        setTopics(
          response.data.response.topics.map((topic) => ({
            label: topic.label,
            wikiLink: topic.wikiLink,
            score: topic.score,
          }))
        );
      }

      //entities
      else if (response.data.response.entities) {
        setEntityApi(true);
        setTopicApi(false);
        setEntailmentApi(false);
        setPageApi(false);
        setEntity(
          response.data.response.entities.map((entity) => ({
            name: entity.entityId,
            wikiLink: entity.wikiLink,
            confidence: entity.confidenceScore,
            relevance: entity.relevanceScore,
          }))
        );
      }

      //entailments
      else if (response.data.response.entailments) {
        setEntailmentApi(true);
        setEntityApi(false);
        setTopicApi(false);
        setPageApi(false);
        const totalSentences = response.data.response.sentences.length;
        const language = response.data.response.language;
        setEntailment({
          totalSentences,
          language,
        });
      } else {
        setTopicApi(false);
        setEntityApi(false);
        setEntailmentApi(false);
        setPageApi(false);
        setEntity([]);
        setEntailment([]);
        setTopicHighlights([]);
        setTopics([]);
      }
    } catch (error) {
      console.error(`Error calling ${extractor} API:`, error);
    }
  };

  const scanPage = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/scan-page", {
        url: currentUrl,
        extractor: "topics",
      });

      if (response.data.response.topics) {
        setPageApi(true);
        setTopicApi(false);
        setEntityApi(false);
        setEntailmentApi(false);

        setPageHighlights(
          response.data.response.coarseTopics.map((topic) => ({
            label: topic.label,
            wikiLink: topic.wikiLink,
          }))
        );
        setPageTopics(
          response.data.response.topics.map((topic) => ({
            label: topic.label,
            wikiLink: topic.wikiLink,
            score: topic.score,
          }))
        );
      } else {
        setTopicApi(false);
        setEntityApi(false);
        setEntailmentApi(false);
        setPageApi(false);
        setEntity([]);
        setEntailment([]);
        setTopicHighlights([]);
        setTopics([]);
      }
    } catch (error) {
      console.error(
        "Error calling scan-page API:",
        error.response?.data || error.message
      );
    }
  };

  //clear button
  const handleClearText = () => {
    setInputText("");
  };

  return (
    <>
      <div className="w-100 p-4 bg-white text-gray-800">
        {/* Header */}
        <header className="mb-4">
          <h1 className="text-2xl font-bold text-center text-blue-600">
            Content Analyzer
          </h1>
          <p className="text-sm text-gray-500 text-center">
            Analyze text or webpage content efficiently
          </p>
        </header>

        {/* URL Section */}
        <div className="mb-4 flex justify-center">
          <button
            onClick={() => (currentUrl ? scanPage() : alert("Refresh Page"))}
            // onClick={() => scanPage()}
            className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 transition flex items-center gap-2"
          >
            <span>📄</span> Scan This Page
          </button>
        </div>

        {/* Input Section */}
        <textarea
          className="w-full p-2 border rounded-md"
          placeholder="Paste your text here..."
          rows="5"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          maxLength={maxLength}
        ></textarea>
        {/* Remaining Characters */}
        <p className="text-sm text-gray-600 mt-2">
          {maxLength - inputText.length} characters remaining
        </p>

        {/* Cleaning Button */}
        {inputText && (
          <div className="flex justify-center">
            <button
              onClick={handleClearText}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
            >
              <span>🗑️</span> Clear Text
            </button>
          </div>
        )}

        <div className="flex flex-col p-4 text-center">
          <div className="font-medium text-lg">Analysis Options</div>

          <div className="flex text-sm gap-2 justify-center">
            <button
              onClick={() => fetchData("topics")}
              className="w-[30%] mt-4 bg-blue-500 text-white py-2 px-2 rounded-md hover:bg-blue-600 transition"
            >
              <span>📚</span> Topics
            </button>
            <button
              onClick={() => fetchData("entities")}
              className="w-[30%] mt-4 bg-blue-500 text-white py-2 px-2 rounded-md hover:bg-blue-600 transition"
            >
              <span>👤</span> Entities
            </button>
            <button
              onClick={() => fetchData("entailments")}
              className="w-[40%] mt-4 bg-blue-500 text-white py-2 px-2 rounded-md hover:bg-blue-600 transition"
            >
              <span>🧩</span> Entailments
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="mt-4 p-2 border rounded-md bg-gray-100">
          <p className="rounded-md p-2 text-gray-600">
            {topicApi ? (
              <div>
                <p className="font-bold text-lg justify-center flex py-2">
                  Domains
                </p>
                {topicHighlights.map((highlight, index) => (
                  <div
                    className="flex border bg-white rounded-md mb-2 ps-2 py-1 text-sm justify-between"
                    key={index}
                  >
                    {" "}
                    <div className="font-medium">{highlight.label}</div>
                    <div>
                      <a
                        href={highlight.wikiLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 me-2 text-xs underline"
                      >
                        {highlight.label}'s Article (Wiki)
                      </a>
                    </div>
                  </div>
                ))}
                <p className="font-bold text-lg justify-center flex py-2 mt-5">
                  All Topics
                </p>
                {topics.map((topic, index) => {
                  let scoreLevel = "Low";
                  let scoreColor = "text-red-500";
                  let scoreEmoji = "❌";

                  if (topic.score > 0.7) {
                    scoreLevel = "High";
                    scoreColor = "text-green-500";
                    scoreEmoji = "✅";
                  } else if (topic.score > 0.4) {
                    scoreLevel = "Medium";
                    scoreColor = "text-yellow-500";
                    scoreEmoji = "⚠️";
                  }
                  console.log(topic);
                  return (
                    <div
                      className="bg-white border rounded-md mb-2 ps-2 py-1 text-sm justify-between"
                      key={index}
                    >
                      <div className="flex justify-between">
                        <p className="font-medium text-md">{topic.label}</p>
                        <a
                          href={topic.wikiLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 text-xs underline me-2"
                        >
                          Wikipedia Link
                        </a>
                      </div>

                      {/* Score Display with Emoji */}
                      <div className="text-sm">
                        Relevance Score:&nbsp;
                        <span className={scoreColor}>
                          {scoreLevel} {scoreEmoji}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : pageApi ? (
              <div>
                <p className="font-bold justify-center text-lg flex py-2">
                  Domains
                </p>
                {pageHighlights.map((highlight, index) => (
                  <div
                    className="flex border bg-white rounded-md mb-2 ps-2 py-1 text-sm justify-between"
                    key={index}
                  >
                    {" "}
                    <div className="font-medium">{highlight.label}</div>
                    <div>
                      <a
                        href={highlight.wikiLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 me-2 text-xs underline"
                      >
                        {highlight.label}'s Article (Wiki)
                      </a>
                    </div>
                  </div>
                ))}
                <p className="font-bold text-lg justify-center flex py-2 mt-5">
                  All Topics
                </p>
                {pageTopics.map((topic, index) => {
                  let scoreLevel = "Low";
                  let scoreColor = "text-red-500";
                  let scoreEmoji = "❌";

                  if (topic.score > 0.7) {
                    scoreLevel = "High";
                    scoreColor = "text-green-500";
                    scoreEmoji = "✅";
                  } else if (topic.score > 0.4) {
                    scoreLevel = "Medium";
                    scoreColor = "text-yellow-500";
                    scoreEmoji = "⚠️";
                  }
                  console.log(topic);
                  return (
                    <div
                      className="bg-white border rounded-md mb-2 ps-2 py-1 text-sm justify-between"
                      key={index}
                    >
                      <div className="flex justify-between">
                        <p className="font-medium text-md">{topic.label}</p>
                        <a
                          href={topic.wikiLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 text-xs underline me-2"
                        >
                          Wikipedia Link
                        </a>
                      </div>

                      {/* Score Display with Emoji */}
                      <div className="text-sm">
                        Relevance Score:&nbsp;
                        <span className={scoreColor}>
                          {scoreLevel} {scoreEmoji}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : entityApi ? (
              <div>
                <p className="font-bold text-lg justify-center flex py-2">
                  Entities Information
                </p>
                {entity.map((entity, index) => {
                  let scoreLevel = "Low";
                  let scoreColor = "text-red-500";
                  let scoreEmoji = "❌";

                  if (entity.relevance > 0.7) {
                    scoreLevel = "High";
                    scoreColor = "text-green-500";
                    scoreEmoji = "✅";
                  } else if (entity.relevance > 0.4) {
                    scoreLevel = "Medium";
                    scoreColor = "text-yellow-500";
                    scoreEmoji = "⚠️";
                  }

                  let confidenceLevel = "Low";
                  let confidenceColor = "text-red-500";
                  let confidenceEmoji = "❌";

                  if (entity.confidence > 7) {
                    confidenceLevel = "High";
                    confidenceColor = "text-green-500";
                    confidenceEmoji = "✅";
                  } else if (entity.confidence > 4) {
                    confidenceLevel = "Medium";
                    confidenceColor = "text-yellow-500";
                    confidenceEmoji = "⚠️";
                  }
                  console.log(entity);
                  return (
                    <div
                      className="flex flex-col border bg-white rounded-md mb-2 ps-2 py-1 text-sm justify-between"
                      key={index}
                    >
                      <div className="flex justify-between">
                        <p className="font-medium text-md">{entity.name}</p>
                        {entity.wikiLink && (
                          <a
                            href={entity.wikiLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 text-xs underline me-2"
                          >
                            Wikipedia Link
                          </a>
                        )}
                      </div>

                      {/* Score Display with Emoji */}
                      <div className="">
                        <div className="text-sm">
                          Relevance Score:&nbsp;
                          <span className={scoreColor}>
                            {scoreLevel} {scoreEmoji}
                          </span>
                        </div>
                        <div className="text-sm">
                          Confidence Score:&nbsp;
                          <span className={confidenceColor}>
                            {confidenceLevel} {confidenceEmoji}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : entailmentApi ? (
              <div>
                <p className="font-bold text-lg justify-center flex py-2">
                  Entailments
                </p>
                {entailment.totalSentences && entailment.language ? (
                  <div className="flex flex-col border bg-white rounded-md mb-2 ps-2 py-1 text-sm justify-between">
                    <p>
                      <strong>Total Sentences:</strong>{" "}
                      {entailment.totalSentences}
                    </p>
                    <p>
                      <strong>Language:</strong> {entailment.language}
                    </p>
                  </div>
                ) : (
                  <p>No Entailments Found</p>
                )}
              </div>
            ) : (
              <p className="text-sm flex justify-center">
                Choose an Analysis Option to View Results
              </p>
            )}
          </p>
        </div>

        {/* Footer */}
        <footer className="mt-4 text-center text-xs text-gray-500">
          <p>Powered by TextRazor APIs</p>
          <p className="mt-1 font-medium">
            © {new Date().getFullYear()} Vatsal Tandel. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
}

export default App;