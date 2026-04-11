import { useState } from "react";

export default function Attendance() {
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);

  const handleCheckIn = () => {
    const time = new Date().toLocaleTimeString();
    setCheckIn(time);
  };

  const handleCheckOut = () => {
    const time = new Date().toLocaleTimeString();
    setCheckOut(time);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Chấm công</h1>

      <button
        onClick={handleCheckIn}
        className="bg-green-500 text-white px-4 py-2 mr-2"
      >
        Check In
      </button>

      <button
        onClick={handleCheckOut}
        className="bg-red-500 text-white px-4 py-2"
      >
        Check Out
      </button>

      <div className="mt-4">
        <p>Check In: {checkIn}</p>
        <p>Check Out: {checkOut}</p>
      </div>
    </div>
  );
}
