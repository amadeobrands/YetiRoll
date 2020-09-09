import React, {useEffect} from "react";

// This is a hack to keep the type in sync
const TimeKeeper = (props) => {
  let {streamManager, provider, setTime, time} = props;

  useEffect(() => {
    provider
      .getBlock()
      .then((block) => block.timestamp)
      .then(setTime);

    const watcher = setInterval(() => {
      provider
        .getBlock()
        .then((block) => block.timestamp)
        .then(setTime);

      provider.send("evm_mine", []);
    }, 5000);

    return () => clearInterval(watcher);
  }, [provider, streamManager, setTime]);

  if (undefined === time) {
    return <h3>Loading time stamp</h3>;
  }

  return (
    <h3>
      Blockchain time is: {new Date(time * 1000).toTimeString()} : {time}
    </h3>
  );
};

export default TimeKeeper;
