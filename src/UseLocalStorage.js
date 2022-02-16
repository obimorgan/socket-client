/** @format */

//------>Function to persist id on local storage<-----//
import { useEffect, useState } from "react";

const PREFIX = "d8-socketio";

//-------------->Getting value from local storage<-------------//
export default function useLocalStorage(key, initialValue) {
  const prefixdKey = PREFIX + key;
  const [value, setValue] = useState(() => {
    const jsonValue = localStorage.getItem(prefixdKey);
    if (jsonValue !== null) return JSON.parse(jsonValue); //Parse the value to json for bettter performance
    if (typeof initialValue === "function") {
      return initialValue();
    } else {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(prefixdKey, JSON.stringify(value));
  }, [prefixdKey, value]);
  return [value, setValue];
}
