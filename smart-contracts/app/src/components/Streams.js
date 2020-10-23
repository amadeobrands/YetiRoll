import React from "react";
import PausableStreamBuilder from "./PausableStreamBuilder";

const Streams = (props) => {
  let {streamManager, provider, erc20, time} = props;

  return (
    <PausableStreamBuilder
      erc20={erc20}
      streamManager={streamManager}
      provider={provider}
      time={time}
    />
  );
};

export default Streams;
