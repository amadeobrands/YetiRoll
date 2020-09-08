import React, {useCallback, useEffect, useState} from "react";
import PausableStream from "./PausableStream";
import {BigNumber} from "ethers";

const PausableStreamBuilder = (props) => {
  let {streamManager, provider, erc20} = props;

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
      />
    );
  };

  return <div>{renderer()}</div>;
};

const PausableStreamForm = (props) => {
  let {erc20, streamManager, recipient, setHasStream} = props;

  const createPausableStream = () => {
    streamManager
      .createPausableStream(
        recipient,
        BigNumber.from(1).mul(BigNumber.from(10).pow(18)),
        erc20.address,
        3600,
        Math.ceil(BigNumber.from(new Date().getTime()).div(1000).add(10))
      )
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
        ])}
      />
    </form>
  );
};

export default PausableStreamBuilder;
