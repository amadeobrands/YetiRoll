import React, {useCallback, useEffect, useState} from "react";
import PausableStream from "./PausableStream";

const PausableStreamBuilder = (props) => {
  let {streamManager, provider, token} = props;

  const [alice, setAlice] = useState(undefined);
  const [bob, setBob] = useState(undefined);
  const [aliceStreamManager, setAliceStreamManager] = useState(undefined);
  const [hasStream, setHasStream] = useState(undefined);

  useEffect(() => {
    provider.listAccounts().then((accounts) => {
      setAlice(accounts[0]);
      setBob(accounts[1]);
    });
  }, []);

  useEffect(() => {
    if (undefined !== streamManager && undefined !== alice) {
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
          recipient={bob}
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
      .then(console.log);
    // .then((block) => {
    //   if (block.confirmations > 0) {
    //     setHasStream(true);
    //   }
    // });
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
