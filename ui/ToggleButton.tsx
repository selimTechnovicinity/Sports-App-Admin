"use client";
import { toast } from "@/hooks/use-toast";
import { disableUser, restoreUser } from "@/lib/api";
import { useState } from "react";

const ToggleButton = ({
  status,
  id,
}: {
  status: boolean;
  id: { id: string };
}) => {
  const [isOn, setIsOn] = useState(status);

  const toggleSwitch = async () => {
    setIsOn(!isOn);
    if (isOn !== true) {
      const res = await restoreUser(id);
      if (res?.status === "success") {
        toast({
          description: "Abilitato",
        });
      }
    } else {
      const res = await disableUser(id);
      if (res?.status === "success") {
        toast({
          description: "Disabili",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <button
      onClick={toggleSwitch}
      className={`w-14 h-7 flex items-center rounded-full p-1 transition duration-300 ${
        isOn ? "bg-green-500" : "bg-gray-400"
      }`}
    >
      <div
        className={`w-6 h-6 bg-white rounded-full shadow-md transform transition duration-300 ${
          isOn ? "translate-x-7" : "translate-x-0"
        }`}
      />
    </button>
  );
};

export default ToggleButton;
