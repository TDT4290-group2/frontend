import { ToastContainer, toast } from "react-toastify";
import { Button } from "./button";

export function Notifications() {
  const dustNotification = () => {
    toast(showDustNotification, {
      position: "bottom-center",
      autoClose: false,
      className: 'p-0 w-[400px] border border-grey-600/40',
    });
  };

  const vibrationNotification = () => {
    toast(showVibrationNotification, {
      position: "bottom-center",
      autoClose: false,
      className: 'p-0 w-[400px] border border-grey-600/40',
    });
  };

  const noiseNotification = () => {
    toast(showNoiseNotification, {
      position: "bottom-center",
      autoClose: false,
      className: 'p-0 w-[400px] border border-grey-600/40',
    });
  };
    
  return (
    <div>
      <div>
        <Button onClick={dustNotification}>Test</Button>
        <ToastContainer />
      </div>
      <div>
        <Button onClick={vibrationNotification}>Test</Button>
        <ToastContainer />
      </div>
      <div>
        <Button onClick={noiseNotification}>Test</Button>
        <ToastContainer />
      </div>
    </div>
  );
};

function showDustNotification() {
  return (
    <div className="grid grid-cols-[40px_1fr_2fr] w-full">
      <div className="flex items-center justify-center p-1">
        <img
          src="/icons/dustIcon.png"
          alt="Dust icon"
          className="w-10 h-10 object-cover rounded"
        />
      </div>
      <div className="flex flex-col p-1">
        <h3 className="text-zinc-800 text-sm font-semibold">Dust</h3>
        <p className="text-sm text-orange-600">Warning</p>
      </div>

      <div className="flex flex-col p-1">
        <p className="text-sm text-zinc-600 text-right">Wed 1st April 9.41 AM</p>
      </div>
    </div>
  );
}

function showVibrationNotification() {
  return (
    <div className="grid grid-cols-[40px_1fr_2fr] w-full">
      <div className="flex items-center justify-center p-1">
        <img
          src="/icons/vibrationIcon.png"
          alt="Vibration icon"
          className="w-10 h-10 object-cover rounded"
        />
      </div>
      <div className="flex flex-col p-1">
        <h3 className="text-zinc-800 text-sm font-semibold">Vibration</h3>
        <p className="text-sm text-orange-600">Warning</p>
      </div>

      <div className="flex flex-col p-1">
        <p className="text-sm text-zinc-600 text-right">Wed 1st April 9.41 AM</p>
      </div>
    </div>
  );
}

function showNoiseNotification() {
  return (
    <div className="grid grid-cols-[40px_1fr_2fr] w-full">
      <div className="flex items-center justify-center p-1">
        <img
          src="/icons/noiseIcon.png"
          alt="Noise icon"
          className="w-10 h-10 object-cover rounded"
        />
      </div>
      <div className="flex flex-col p-1">
        <h3 className="text-zinc-800 text-sm font-semibold">Noise</h3>
        <p className="text-sm text-orange-600">Warning</p>
      </div>

      <div className="flex flex-col p-1">
        <p className="text-sm text-zinc-600 text-right">Wed 1st April 9.41 AM</p>
      </div>
    </div>
  );
}