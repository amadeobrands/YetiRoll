import React, {useCallback, useEffect, useState} from "react";
import PausableStream from "./PausableStream";

const PausableStreamBuilder = (props) => {
  let {streamManager, provider, token} = props;

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
          token={token}
          streamManager={aliceStreamManager}
          recipient={bob.getAddress()}
          setHasStream={setHasStream}
        />
      );
    }
  };

  const renderStream = () => {
    return <PausableStream streamManager={streamManager} streamId={1} />;
  };

  return <div>{renderer()}</div>;
};

const PausableStreamForm = (props) => {
  let {token, streamManager, recipient, setHasStream} = props;

  const createPausableStream = () => {
    streamManager
      .createPausableStream(recipient, 100, token.address, 3600, Date.now() + 1)
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
          token,
          streamManager,
        ])}
      />
    </form>
  );
};

export default PausableStreamBuilder;
