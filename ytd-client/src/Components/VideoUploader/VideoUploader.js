import React, { useEffect, useState } from "react";
import axios from "axios";

import Loader from "../../UI/Loader/Loader";
import "./YoutubeUploader.css";
import YouTubeEmbed from "../YouTubeEmbed/YouTubeEmbed";

const VideoUploader = ({
  videoId,
  inputQuality,
  setQuality,
  affordableQuality,
  setAffordableQuality,
  serverURL,
}) => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (videoId !== "") {
      console.log("work");
      fetch(`${serverURL}/quality?url=${videoId}`)
        .then((response) => response.json())
        .then((data) => {
          switch (data) {
            case 2160:
              setAffordableQuality(["1080p", "720p", "480p", "360p"]);
              setQuality("1080p");
              break;
            case 1440:
              setAffordableQuality(["1080p", "720p", "480p", "360p"]);
              setQuality("1080p");
              break;
            case 1080:
              setAffordableQuality(["1080p", "720p", "480p", "360p"]);
              setQuality("1080p");
              break;
            case 720:
              setAffordableQuality(["720p", "480p", "360p"]);
              setQuality("720p");
              break;
            case 480:
              setAffordableQuality(["480p", "360p"]);
              setQuality("480p");
              break;
            case 360:
              setAffordableQuality(["360p"]);
              setQuality("360p");
              break;
            default:
              setAffordableQuality(["360p"]);
              setQuality("360p");
              break;
          }
        });
    }
    // eslint-disable-next-line
  }, [videoId]);
  const handleUpload = (e) => {
    e.preventDefault();
    setLoader(true);

    axios
      .get(`${serverURL}/videoDownload`, {
        params: {
          url: videoId,
          startTime: startTime,
          endTime: endTime,
          quality: inputQuality,
        },
        responseType: "blob", // Встановити тип відповіді як blob
      })
      .then((response) => {
        const videoBlob = new Blob([response.data], { type: "video/mp4" });
        const videoUrl = URL.createObjectURL(videoBlob);

        const downloadLink = document.createElement("a");
        downloadLink.href = videoUrl;
        downloadLink.download = "trimmed_video.mp4";
        downloadLink.click();

        URL.revokeObjectURL(videoUrl);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Помилка при завантаженні відео:", error);
      });
  };

  const startTimeHandler = (e) => {
    e.preventDefault();
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d\d)(\d)/g, "$1:$2");
    value = value.replace(/:(\d\d)(\d)/, ":$1:$2");
    setStartTime(value);
  };
  const changeQuality = (e) => {
    e.preventDefault();
    setQuality(e.target.value);
  };
  const endTimeHandler = (e) => {
    e.preventDefault();
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d\d)(\d)/g, "$1:$2");
    value = value.replace(/:(\d\d)(\d)/, ":$1:$2");
    setEndTime(value);
  };

  if (!videoId) {
    return <h2>No Video</h2>;
  } else {
    return (
      <div className="container">
        <YouTubeEmbed videoId={videoId} />
        <form onSubmit={handleUpload} className="form-container">
          <div className="time-inputs">
            <label>Start time ('HH:MM:SS')</label>
            <input
              type={"text"}
              placeholder={"00:00:00"}
              onChange={startTimeHandler}
              value={startTime}
            />
            <label>End time ('HH:MM:SS')</label>
            <input
              type={"text"}
              placeholder={"00:00:00"}
              onChange={endTimeHandler}
              value={endTime}
            />
            <select className="select" onChange={changeQuality}>
              {affordableQuality.map((quality) => (
                <option key={quality} value={quality}>
                  {quality}
                </option>
              ))}
            </select>
          </div>
          <button type={"submit"} className="submit-button">
            Download
          </button>
        </form>
        <div></div>
        {loader && (
          <div className="container2">
            <Loader />
          </div>
        )}
      </div>
    );
  }
};

export default VideoUploader;
