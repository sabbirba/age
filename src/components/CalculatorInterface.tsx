"use client";

import { useEffect, useRef, useState } from "react";

/* eslint-disable @next/next/no-img-element */
export default function CalculatorInterface() {
  const [day, setDay] = useState(0 || "");
  const [month, setMonth] = useState(0 || "");
  const [year, setYear] = useState(0 || "");
  const [ageYears, setAgeYears] = useState("--");
  const [ageMonths, setAgeMonths] = useState("--");
  const [ageDays, setAgeDays] = useState("--");
  const [calculated, setCalculated] = useState(false);
  const currentYear = 2025;

  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  const padStart = (
    value: number | string,
    targetLength: number,
    padChar: string = "0"
  ): string => {
    const stringValue = String(value);
    return stringValue.length >= targetLength
      ? stringValue
      : (padChar.repeat(targetLength) + stringValue).slice(-targetLength);
  };

  const triggerWarn = (parentNode: any, childNode: any) => {
    parentNode.querySelector("input").style.borderColor = "#FF5757";
    parentNode.querySelector(".warn-text").hidden = false;
    childNode.color = "FF5757#";
    childNode.fontWeight = "bold";
  };

  const removeWarn = (parentNode: any, childNode: any) => {
    parentNode.querySelector("input").style.borderColor = null;
    parentNode.querySelector(".warn-text").hidden = true;
    childNode.color = null;
    childNode.fontWeight = null;
    childNode.borderColor = null;
  };

  const handleDay = (e: any) => {
    let parentNode = e.target.parentNode.parentNode;
    let childNode = parentNode.querySelector("#d-label").style;

    if (e.target.value > 31) {
      triggerWarn(parentNode, childNode);
    } else {
      setDay(padStart(e.target.value, 2));
      removeWarn(parentNode, childNode);
    }
  };

  const handleMonth = (e: any) => {
    let parentNode = e.target.parentNode.parentNode;
    let childNode = parentNode.querySelector("#m-label").style;

    if (e.target.value > 12) {
      triggerWarn(parentNode, childNode);
    } else {
      setMonth(padStart(e.target.value, 2));
      removeWarn(parentNode, childNode);
    }
  };

  const handleYear = (e: any) => {
    let parentNode = e.target.parentNode.parentNode;
    let childNode = parentNode.querySelector("#y-label").style;

    if (e.target.value > 2024) {
      triggerWarn(parentNode, childNode);
    } else {
      setYear(e.target.value);
      removeWarn(parentNode, childNode);
    }
  };

  useEffect(() => {
    // Only calculate if all fields are filled
    if (day && month && year) {
      const today = new Date();
      const birthDate = new Date(Number(year), Number(month) - 1, Number(day));

      let years = today.getFullYear() - birthDate.getFullYear();
      let months = today.getMonth() - birthDate.getMonth();
      let days = today.getDate() - birthDate.getDate();

      if (days < 0) {
        months -= 1;
        // Get days in previous month
        const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += prevMonth.getDate();
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }

      setAgeYears(years >= 0 ? padStart(years, 2) : "--");
      setAgeMonths(months >= 0 ? padStart(months, 2) : "--");
      setAgeDays(days >= 0 ? padStart(days, 2) : "--");
      setCalculated(true); // Show arrow
    } else {
      setAgeYears("--");
      setAgeMonths("--");
      setAgeDays("--");
      setCalculated(false); // Hide arrow
    }
  }, [day, month, year]);

  return (
    <div className="shadow-2xl max-md:space-y-5 bg-white shadow-neutral-400 w-fit p-14 max-md:px-5 rounded-xl rounded-br-[200px] max-md:rounded-br-[125px]">
      <div className="flex max-md:justify-center justify-between gap-5 w-[500px] max-md:w-[85vw] text-[#716F6F] font-semibold text-xs max-md:text-md">
        <div className="space-y-1">
          <div className="transition-colors" id="d-label">
            D A Y
          </div>
          <div>
            <input
              ref={dayRef}
              className="text-black transition-colors outline-none font-bold border-2 border-[#DBDBDB] p-4  rounded-md w-full text-[32px] max-md:text-xl"
              type="text"
              placeholder="DD"
              onChange={handleDay}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  monthRef.current?.focus();
                }
              }}
            />
          </div>
          <span
            hidden
            className="warn-text italic text-center text-xs max-md:text-[0.6rem] font-light text-[#FF5757]"
          >
            Must be a valid day
          </span>
        </div>
        <div className="space-y-1">
          <div className="transition-colors" id="m-label">
            M O N T H
          </div>
          <div>
            <input
              ref={monthRef}
              className="text-black transition-colors outline-none font-bold border-2 border-[#DBDBDB] p-4 rounded-md w-full text-[32px]  max-md:text-xl"
              type="text"
              placeholder="MM"
              onChange={handleMonth}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  yearRef.current?.focus();
                }
              }}
            />
          </div>
          <span
            hidden
            className="warn-text italic text-xs max-md:text-[0.6rem] font-light text-[#FF5757]"
          >
            Must be a valid month
          </span>
        </div>
        <div className="space-y-1">
          <div className="transition-colors" id="y-label">
            Y E A R
          </div>
          <div>
            <input
              ref={yearRef}
              className=" text-black transition-colors outline-none font-bold border-2 border-[#DBDBDB] p-4 rounded-md w-full text-[32px]  max-md:text-xl"
              type="text"
              placeholder="YYYY"
              onChange={handleYear}
            />
          </div>
          <span
            hidden
            className="warn-text italic text-xs max-md:text-[0.6rem] font-light text-[#FF5757]"
          >
            Must be in the past
          </span>
        </div>
      </div>
      <div className="flex relative items-center justify-end  max-md:justify-center w-[700px] h-32 max-md:h-20 max-md:w-[85vw]">
        <hr className="border w-full" />
        {calculated && (
          <span
            className="absolute right-0 bg-[#854DFF] p-4 rounded-full flex items-center justify-center shadow-lg"
            style={{ top: "50%", transform: "translateY(-50%)" }}
          >
            {/* Arrow SVG */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="16" fill="#854DFF" />
              <path
                d="M16 10V22M16 22L10 16M16 22L22 16"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
      </div>
      <div
        className="text-8xl max-md:text-4xl italic space-y-4 max-md:space-y-3"
        id="bottom"
      >
        <div className="space-x-5 max-md:space-x-3">
          <span className="text-[#854DFF] align-top">{ageYears}</span>
          <span>years</span>
        </div>
        <div className="space-x-5 max-md:space-x-3">
          <span className="text-[#854DFF] align-top">
            {ageMonths}
          </span>
          <span>months</span>
        </div>
        <div className="space-x-5 max-md:space-x-3">
          <span className="text-[#854DFF] align-top  ">
            {ageDays}
          </span>
          <span>days</span>
        </div>
      </div>
    </div>
  );
}
