import "./App.css";
import { Fragment, useState } from "react";

import YoutubeTranscript from "./Pages/YoutubeTranscript";
import { Navigate, Route, Routes } from "react-router-dom";
import YoutubeFragmentDownloader from "./Pages/YoutubeFragmentDownloader";
import Navbar from "./UI/Navbar/Navbar";

function App() {
  const serverURL = "http://localhost:3000";
  const [currentURL, setCurrentUrl] = useState("");
  const [videoDownloadUrl, setVideoDownloadUrl] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [data, setData] = useState(null);
  const [inputQuality, setQuality] = useState("");
  const [affordableQuality, setAffordableQuality] = useState([]);

  return (
    <Fragment>
      <Routes>
        <Route path={"/"} element={<Navbar />}>
          <Route
            index
            element={
              <YoutubeTranscript
                currentURL={currentURL}
                setCurrentUrl={setCurrentUrl}
                currentPrompt={currentPrompt}
                setCurrentPrompt={setCurrentPrompt}
                data={data}
                setData={setData}
                serverURL={serverURL}
                inputQuality={inputQuality}
                setQuality={setQuality}
                affordableQuality={affordableQuality}
                setAffordableQuality={setAffordableQuality}
              />
            }
          />
          <Route
            path={"/videoDownloader"}
            element={
              <YoutubeFragmentDownloader
                currentURL={videoDownloadUrl}
                setCurrentUrl={setVideoDownloadUrl}
                inputQuality={inputQuality}
                setQuality={setQuality}
                affordableQuality={affordableQuality}
                setAffordableQuality={setAffordableQuality}
                serverURL={serverURL}
              />
            }
          />
          <Route path={"*"} element={<Navigate to={"/"} replace />} />
        </Route>
      </Routes>
    </Fragment>
  );
}

export default App;
