import React from "react";
import PausableStreamBuilder from "./PausableStreamBuilder";

const Streams = (props) => {
  let {streamManager, provider, token} = props;

  return (
    <PausableStreamBuilder
      token={token}
      streamManager={streamManager}
      provider={provider}
    />
  );
};

export default Streams;
