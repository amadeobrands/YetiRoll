import React from "react";
import PausableStreamBuilder from "./PausableStreamBuilder";

const Streams = (props) => {
  let {streamManager, provider, erc20} = props;

  return (
    <PausableStreamBuilder
      erc20={erc20}
      streamManager={streamManager}
      provider={provider}
    />
  );
};

export default Streams;
