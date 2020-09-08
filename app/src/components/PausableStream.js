import React, {useEffect, useState} from "react";

import {BigNumber} from "ethers";

const PausableStream = (props) => {
  let {streamId, streamManager, provider} = props;
  const [stream, setStream] = useState(undefined);
  const [watcher, setWatcher] = useState(undefined);
  const [time, setTime] = useState(undefined);

  useEffect(() => {
    const watcher = setInterval(() => {
      streamManager.getPausableStream(streamId).then(setStream);
      streamManager
        .now()
        .then((time) => time.mul(1000))
        .then(setTime);

      // Process the block
      provider.send("evm_mine", []);
    }, 1000);

    return () => clearInterval(watcher);
  }, [streamId, provider, streamManager]);

  if (undefined === time || undefined === stream) {
    return <div>Loading..</div>;
  }

  console.log(stream);

  return (
    <div>
      <p> {stream.durationElapsed.toString()}</p>
      <p> {stream.isRunning ? "running" : "not"}</p>
      <p>
        {"Start time: "}
        {new Date(stream.startTime.mul(1000).toNumber()).toTimeString()}{" "}
        {new Date(stream.startTime.mul(1000).toNumber()).toDateString()}
      </p>
      <p>
        {"Block time: "}
        {new Date(time.toNumber()).toTimeString()}{" "}
        {new Date(time.toNumber()).toDateString()}
      </p>
      <p>
        {"Current time: "}
        {new Date().toTimeString()}
        {new Date().toDateString()}
      </p>
      <p>{stream.balanceAccrued.div(BigNumber.from(10).pow(18)).toString()}</p>
    </div>
  );

  if (undefined === stream) {
    return <div>Loading stream...</div>;
  }
  console.log(stream);
  return (
    <div>
      <p>
        {new Date(time * 1000).toTimeString()}{" "}
        {new Date(time * 1000).toDateString()}
      </p>
      <p>
        {new Date(stream.startTime.toNumber()).toTimeString()}{" "}
        {new Date(stream.startTime.toNumber()).toDateString()}
      </p>
      <p>{stream.duration.toNumber()}</p>
      <p>{stream.durationElapsed.toNumber()}</p>
      <p>{stream.durationRemaining.toNumber()}</p>
      <p>{stream.deposit.toNumber()}</p>
      <p>{stream.balanceAccrued.toNumber()}</p>
    </div>
  );
};

export default PausableStream;
