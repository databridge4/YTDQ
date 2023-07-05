import React from "react";
import Card from "../UI/Card/Card";
import Form from "../Components/Form/Form";
import TranscriptComponent from "../Components/TranscriptComponent/TranscriptComponent";

const YoutubeTranscript = ({
  currentURL,
  setCurrentUrl,
  currentPrompt,
  setCurrentPrompt,
  data,
  setData,
  serverURL,
  inputQuality,
  setQuality,
  affordableQuality,
  setAffordableQuality,
}) => {
  return (
    <div className="App">
      <Card>
        <h1>{"Search for quotes by video link"}</h1>
      </Card>
      <Card>
        <Form
          currentLink={currentURL}
          currentUrl={setCurrentUrl}
          setPrompt={setCurrentPrompt}
          prompt={currentPrompt}
          type={"transcript"}
          setData={setData}
        />
      </Card>
      <Card>
        <TranscriptComponent
          videoId={currentURL}
          prompt={currentPrompt}
          data={data}
          setData={setData}
          serverURL={serverURL}
          inputQuality={inputQuality}
          setQuality={setQuality}
          affordableQuality={affordableQuality}
          setAffordableQuality={setAffordableQuality}
        />
      </Card>
    </div>
  );
};

export default YoutubeTranscript;
