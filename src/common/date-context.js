// app/globals/DateContext.js
"use client";

import { createContext, useState, useContext } from "react";

const DateContext = createContext();

export const DateProvider = ({ children }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  return (
    <DateContext.Provider
      value={{ startDate, setStartDate, endDate, setEndDate }}
    >
      {children}
    </DateContext.Provider>
  );
};

export const useDateContext = () => useContext(DateContext);
