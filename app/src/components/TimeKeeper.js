import React, {useEffect} from "react";
import TextField from "@material-ui/core/TextField";

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

    let now = new Date(time * 1000);

    return (
        <div>
          <TextField
              id="date"
              label="Date"
              type="date"
              defaultValue={now.toDateString()}
              InputLabelProps={{
                shrink: true,
              }}
          />
          <TextField
              id="time"
              label="Time"
              type="time"
              defaultValue={now.toLocaleTimeString()}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min
              }}
          />
            <h3>
                Blockchain time is: {now.toTimeString()} : {time}
            </h3>
        </div>
    );
};

export default TimeKeeper;
