import React, {useEffect} from "react";

const PausableStream = (props) => {
  let {streamId, streamManager} = props;
  console.log(streamManager);

  useEffect(() => {
    if (undefined !== streamId || undefined !== streamManager) {
      console.log(streamId);
      streamManager.getPausableStream(streamId).then(console.log);
    }
  }, []);

  return (
    <div>
      <p>yo</p>
    </div>
  );

  //
  // useEffect(() => {
  //     company.employees(alice).then(setEmployeeAddress)
  // }, [alice]);
  //
  // useEffect(() => {
  //     if (undefined !== employeeAddress) {
  //         setEmployeeContract(new Contract(employeeAddress, StreamEmployee.abi, provider.getSigner()));
  //     }
  // }, [employeeAddress]);
  //
  // useEffect(() => {
  //     if (undefined !== employeeContract) {
  //         employeeContract.payPerSecond().then(setPayPerSecond);
  //     }
  // }, [employeeContract]);
  //
  // useEffect(() => {
  //     if (undefined !== payPerSecond) {
  //         const interval = setInterval(() => {
  //             setSeconds(seconds => seconds + 1)
  //             setBalanceEarned(payPerSecond.mul(seconds))
  //         }, 1000)
  //
  //         return () => clearInterval(interval);
  //     }
  // }, [payPerSecond, seconds]);
  //
  // const startWorking = async () => {
  //     await employeeContract.startWorking()
  //     await employeeContract.isWorking().then(setIsWorking)
  // }
  //
  // const displayWorkingClock = () => {
  //     if (isWorking) {
  //         return (
  //             <div>
  //                 <p>Pay per second {payPerSecond.toString()}</p>
  //                 <p>Time worked {seconds}</p>
  //                 <p>Balance {utils.formatEther(balanceEarned.toString())}</p>
  //             </div>
  //         )
  //     }
  //     return (
  //         <div>
  //             Not working
  //         </div>
  //     )
  // }
  //
  // return (
  //     <div>
  //         <p>Contract address: {employeeAddress}</p>
  //         <input type="submit"
  //                value="Start working"
  //                onClick={
  //                    useCallback(
  //                        () => startWorking(),
  //                        [employeeContract]
  //                    )
  //                }
  //         />
  //
  //         {displayWorkingClock()}
  //     </div>
  // )
};

export default PausableStream;
