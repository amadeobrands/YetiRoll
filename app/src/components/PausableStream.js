import React, {useEffect, useState} from "react";

const PausableStream = (props) => {
  let {streamId, streamManager, provider} = props;
  const [stream, setStream] = useState(undefined);
  const [watcher, setWatcher] = useState(undefined);

  useEffect(() => {
    if (
      undefined !== streamId &&
      undefined !== streamManager &&
      undefined !== provider
    ) {
      const watcher = setInterval(() => {
        streamManager.getPausableStream(streamId).then(setStream);

        provider.send("evm_increaseTime", [1]);

        // Process the block
        provider.send("evm_mine", []);
      }, 1000);

      setWatcher(watcher);
    }
  }, [streamId, streamManager]);

  if (undefined === stream) {
    return <div>Loading stream...</div>;
  }

  return (
    <div>
      <p>Start time {stream.startTime.toNumber()}</p>
      <p>{stream.duration.toNumber()}</p>
      <p>{stream.durationElapsed.toNumber()}</p>
      <p>{stream.durationRemaining.toNumber()}</p>
      <p>{stream.deposit.toNumber()}</p>
      <p>{stream.balanceAccrued.toNumber()}</p>
    </div>
  );
};

export default PausableStream;
