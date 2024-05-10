import React from "react";
import { Button } from "../Button";
import { Icon } from "../Icon";

const AudioControls = ({
  isPlaying,
  onPlayPauseClick,
  onPrevClick,
  onNextClick
}) => (
  <div className="player-controls">
    <div className="control">
      {isPlaying ? (
        <Button onClick={() => onPlayPauseClick(false)}><Icon name='pause' /></Button>
      ) : (
        <Button onClick={() => onPlayPauseClick(true)}><Icon name='play' /></Button>
      )}
    </div>
  </div>
);

export default AudioControls;

//  <Button onClick={onPrevClick}><Icon name='backward' /></Button>
//       <Button onClick={onNextClick}><Icon name='forward' /></Button>
