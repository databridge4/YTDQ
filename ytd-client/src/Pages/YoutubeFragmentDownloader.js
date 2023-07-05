import React from "react";
import Card from "../UI/Card/Card";
import Form from "../Components/Form/Form";
import VideoUploader from "../Components/VideoUploader/VideoUploader";

const YoutubeFragmentDownloader = ({
  currentURL,
  setCurrentUrl,
  inputQuality,
  setQuality,
  affordableQuality,
  setAffordableQuality,
  serverURL,
}) => {
  return (
    <div className={"App"}>
      <Card>
        <h1>{"Video Downloader"}</h1>
      </Card>
      <Card>
        <Form
          currentLink={currentURL}
          currentUrl={setCurrentUrl}
          type={"videoDownloader"}
        />
      </Card>
      <Card>
        <VideoUploader
          videoId={currentURL}
          inputQuality={inputQuality}
          setQuality={setQuality}
          affordableQuality={affordableQuality}
          setAffordableQuality={setAffordableQuality}
          serverURL={serverURL}
        />
      </Card>
    </div>
  );
};

export default YoutubeFragmentDownloader;
