import React, { useEffect, useState } from "react";
import "./TranscriptComponent.css";
import Loader from "../../UI/Loader/Loader";
import YouTubeEmbed from "../YouTubeEmbed/YouTubeEmbed";
import axios from "axios";

const TranscriptComponent = ({
  videoId,
  prompt,
  data,
  setData,
  serverURL,
  inputQuality,
  setQuality,
  affordableQuality,
  setAffordableQuality,
}) => {
  const [ifLoader, setLoader] = useState(false);

  useEffect(() => {
    if (data === "") {
      setData(null);
      const fetchTranscript = async () => {
        try {
          const response = await fetch(
            `${serverURL}/transcript/?videoId=${videoId}&prompt=${prompt}`
          );
          const datas = await response.json();
          setData(datas);
        } catch (error) {
          console.error(error);
        }
      };
      if (videoId !== "" && prompt !== "") {
        fetchTranscript();
      }
    }
    // eslint-disable-next-line
  }, [videoId, prompt, setData, data]);

  useEffect(() => {
    if (videoId !== "") {
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

  function formatTime(time) {
    return time.padStart(5, "0");
  }

  if (!data && videoId === "") {
    return <h2>No results found</h2>;
  } else if (!data) {
    return <Loader />;
  }

  const onClickHandler = (e, end, start) => {
    e.preventDefault();
    handleUpload(start, end);
  };

  const handleUpload = (startTime, endTime) => {
    setLoader(true);
    axios
      .get(`${serverURL}/videoDownload`, {
        params: {
          url: videoId,
          startTime: startTime,
          endTime: endTime,
          quality: inputQuality,
        },
        responseType: "blob",
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
        setLoader(false);
        console.error("Помилка при завантаженні відео:", error);
      });
  };

  const changeQuality = (e) => {
    e.preventDefault();
    setQuality(e.target.value);
  };

  return (
    <div className={"transcript"}>
      <YouTubeEmbed videoId={videoId} />

      <select className="select" onChange={changeQuality}>
        {affordableQuality.map((quality) => (
          <option key={quality} value={quality}>
            {quality}
          </option>
        ))}
      </select>

      {ifLoader && (
        <div className="container2">
          <Loader />
        </div>
      )}

      <h2>Quotes</h2>

      {(data.quote ? data.quote.split(/(\d{1,2}:\d{2})/g) : []).map(
        (line, i, arr) => {
          const isTime = i % 2 !== 0;
          if (isTime) {
            const text = arr[i + 1].trim();
            const formattedText = text.startsWith("-")
              ? text.slice(1).trim()
              : text;
            if (formattedText.length === 0 || formattedText === "-") {
              return null;
            }
            const formattedTime = formatTime(line);
            const nextTime = i + 2 < arr.length ? formatTime(arr[i + 2]) : null;
            return (
              <div key={Math.random() * 1000}>
                <p
                  onClick={(e) =>
                    onClickHandler(
                      e,
                      nextTime
                        ? `00:${nextTime}`
                        : `00:${data.transcript
                            .split("/n")
                            [data.transcript.split("/n").length - 1].slice(
                              0,
                              5
                            )}`,
                      `00:${formattedTime}`
                    )
                  }
                  className={"hover"}
                  key={i}
                >
                  {formattedTime} - {formattedText}
                </p>
              </div>
            );
          }
          return null;
        }
      )}

      <h2>Transcript</h2>

      {data.transcript.split(/(?=\b\d{2}:\d{2}\b)/).map((line, i) => (
        <p key={i}>
          {line}
          <br />
        </p>
      ))}
    </div>
  );
};

export default TranscriptComponent;
