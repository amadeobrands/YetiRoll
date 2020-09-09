import React, {useCallback, useEffect, useState} from "react";
import PausableStream from "./PausableStream";
import {constants} from "ethers";

const PausableStreamBuilder = (props) => {
  let {streamManager, provider, erc20, time} = props;

  const [aliceStreamManager, setAliceStreamManager] = useState(undefined);
  const [hasStream, setHasStream] = useState(undefined);

  const alice = provider.getSigner(0);
  const bob = provider.getSigner(1);

  useEffect(() => {
    if (undefined !== streamManager && undefined === aliceStreamManager) {
      let sm = streamManager.connect(alice);
      setAliceStreamManager(sm);
    }
  }, [streamManager, alice]);

  const renderer = () => {
    if (hasStream) {
      return renderStream();
    } else {
      return (
        <PausableStreamForm
          erc20={erc20}
          streamManager={aliceStreamManager}
          recipient={bob.getAddress()}
          setHasStream={setHasStream}
          time={time}
        />
      );
    }
  };

  const renderStream = () => {
    return (
      <PausableStream
        streamManager={streamManager}
        streamId={1}
        provider={provider}
        time={time}
      />
    );
  };

  return <div>{renderer()}</div>;
};

const PausableStreamForm = (props) => {
  let {erc20, streamManager, recipient, setHasStream, time} = props;

  const createPausableStream = () => {
    streamManager
      .createPausableStream(recipient, 1000, erc20.address, 3600, time + 10)
      .then((block) => {
        if (block.confirmations > 0) {
          setHasStream(true);
        }
      });
  };

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <input
        type="submit"
        onClick={useCallback(() => createPausableStream(), [
          recipient,
          erc20,
          streamManager,
          time,
        ])}
      />
    </form>
  );
};

export default PausableStreamBuilder;
