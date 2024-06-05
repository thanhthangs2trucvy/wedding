import React, { useState, useEffect, useRef } from "react";
import AudioControls from "./AudioControls";
import classNames from "classnames";
import yourImageUrl from 'assets/images/pictures/photobook/1NHA2411.webp';
/*
 * Read the blog post here:
 * https://letsbuildui.dev/articles/building-an-audio-player-with-react-hooks
 */
const AudioPlayer = ({ tracks, played }) => {
  // State
  const [trackIndex, setTrackIndex] = useState(0);
  const [trackProgress, setTrackProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2);
  // Destructure for conciseness
  const { image, audioSrc } = tracks[trackIndex];

  // Refs
  const playRef = useRef(null);
  const audioRef = useRef(new Audio(audioSrc));
  const intervalRef = useRef();
  const isReady = useRef(false);

  const startTimer = () => {
    // Clear any timers already running
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        toNextTrack();
      } else {
        setTrackProgress(audioRef.current.currentTime);
      }
    }, [1000]);
  };

  const toPrevTrack = () => {
    if (trackIndex - 1 < 0) {
      setTrackIndex(tracks.length - 1);
    } else {
      setTrackIndex(trackIndex - 1);
    }
  };

  const toNextTrack = () => {
    if (trackIndex < tracks.length - 1) {
      setTrackIndex(trackIndex + 1);
    } else {
      setTrackIndex(0);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.volume = 0.2;
      audioRef.current.play();
      startTimer();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume])

  useEffect(() => {
    if (isPlaying && volume < 1) {
      const increaseVolume = setInterval(() => {
        setVolume(prevVolume => Math.min(prevVolume + 0.2, 1));
      }, 1000);
      return () => clearInterval(increaseVolume);
    }
  }, [isPlaying, volume]);

  // Handles cleanup and setup when changing tracks
  useEffect(() => {
    audioRef.current.pause();

    audioRef.current = new Audio(audioSrc);
    setTrackProgress(audioRef.current.currentTime);

    if (isReady.current) {
      audioRef.current.play();
      setIsPlaying(true);
      startTimer();
    } else {
      // Set the isReady ref as true for the next pass
      isReady.current = true;
    }
  }, [trackIndex]);

  useEffect(() => {
    // Pause and clean up on unmount
    return () => {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    };
  }, []);

  // useEffect(() => {
  //   const options = {
  //     root: null,
  //     rootMargin: '0px',
  //     threshold: 0.5 // Adjust this threshold as per your need
  //   };

  //   const callback = (entries, observer) => {
  //     entries.forEach(entry => {
  //       if (entry.isIntersecting) {
  //         setIsPlaying(true);
  //       } else {
  //         setIsPlaying(false);
  //       }
  //     });
  //   };

  //   const observer = new IntersectionObserver(callback, options);
  //   observer.observe(playRef.current);

  //   return () => {
  //     observer.disconnect();
  //   };
  // }, []);

  return (
    <div className="player" ref={playRef}>
      <div className="player-content">
        <div className={classNames('album-art', isPlaying && "active")}>
          <img
            className="artwork"
            src={image}
            alt={`Thanh Thanh S2 Truc Vy`}
          />
        </div>
        <AudioControls
          isPlaying={isPlaying}
          onPrevClick={toPrevTrack}
          onNextClick={toNextTrack}
          onPlayPauseClick={setIsPlaying}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
