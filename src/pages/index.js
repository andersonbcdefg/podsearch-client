import Image from 'next/image'
import { Raleway } from 'next/font/google'
import { Concert_One } from 'next/font/google'
import { useState, useRef } from 'react'

const raleway = Raleway({ subsets: ['latin'] })
const concert = Concert_One({ subsets: ['latin'], weight: "400" })

const Spinner = ({ size = 40, color = '#000' }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 50 50">
      <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5" stroke={color} strokeLinecap="round">
        <animate attributeName="stroke-dashoffset" dur="1.5s" repeatCount="indefinite" from="0" to="502" />
        <animate attributeName="stroke-dasharray" dur="1.5s" repeatCount="indefinite" values="150.6 100.4;1 250;150.6 100.4" />
      </circle>
    </svg>
  );
};

function secondsToTimestamp(seconds) {
  const date = new Date(seconds * 1000); // multiply by 1000 to convert seconds to milliseconds
  const hh = date.getUTCHours().toString().padStart(2, '0');
  const mm = date.getUTCMinutes().toString().padStart(2, '0');
  const ss = date.getUTCSeconds().toString().padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

function formatDate(dateString) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const [year, month, day] = dateString.split("-");
  const monthName = months[Number(month) - 1];
  return `${Number(day).toString().padStart(2, "0")} ${monthName}, ${year}`;
}

const SearchResult = ({ result }) => {
  let searchURL = "https://www.youtube.com/results?search_query=";
  if (result.episode_date.slice(0, 4) === "2023" || (result.episode_date.slice(0, 4) === "2022" && result.episode_date.slice(5, 7) > 6)) {
    searchURL += "the+adam+friedland+show+"
  } else {
    searchURL += "cum+town+"
  }
  searchURL += result.episode_title.split(" ").join("+")
  return (
    <div className="flex flex-col w-full h-full items-center justify-between border rounded-md p-4 shadow-md gap-8 md:flex-row">
      <Image alt="podcast cover image" className="overflow-hidden" src="/tafs.jpg" width={250} height={250} />
      <div className="flex flex-col w-full">
        <h2 className={`${concert.className} text-3xl text-center`}>{result.episode_title}</h2>
        <h3 className={`font-mono text-sm text-center`}>{formatDate(result.episode_date)} — {secondsToTimestamp(result.timestamp)}</h3>
        <a className="font-thin text-slate-800 text-lg text-center mb-2 underline decoration-dotted hover:text-slate-400" 
        href={searchURL} target="_blank">Find on Youtube</a>
        <p className={`${raleway.className} text-sm`}>{result.text.endsWith(".") ? result.text : result.text + " [...]"}</p>
      </div>
    </div>
  )
}

export default function Home() {
  const [results, setResults] = useState([]);
  const [numToDisplay, setNumToDisplay] = useState(10); // [10, 20, 30, 40, 50]
  const inputRef = useRef(null);

  const semanticSearch = async (e) => {
    e.preventDefault();
    setResults("loading");
    let query = inputRef.current.value;
    let response = await fetch(`/api/search?query=${encodeURIComponent(query)}`).then((res) => res.json());
    setResults(response.results);
  }

  return (
    <div className="w-full h-full">
      <div className="sticky w-full bg-white p-4 space-y-4 flex items-center justify-start flex-col top-0 border-b border-slate-400 shadow-sm">
        <h1 className={`${concert.className} text-3xl text-center md:text-5xl`}>{process.env.NEXT_PUBLIC_SITE_TITLE}</h1>
        <p className={`${raleway.className} text-md text-center`}>{process.env.NEXT_PUBLIC_SITE_DESCRIPTION}</p>
        <form className="flex w-full items-center justify-center space-x-4" onSubmit={semanticSearch}>
          <input ref={inputRef} className={`w-3/4 h-12 px-4 border-2 border-gray-300 rounded-lg ${raleway.className}`} placeholder="Search for a podcast" />
          <button type="submit" className="h-12 px-4 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-400 transition-colors">Search</button>
        </form>
        <div className="flex flex-row w-full justify-center items-center space-x-4">
          <span>Results to Display:</span>
          <button onClick={() => setNumToDisplay(10)} className={`h-12 px-4 bg-blue-500 text-white rounded-lg cursor-pointer  transition-colors ${numToDisplay === 10 ? "bg-blue-800" : "hover:bg-blue-400"}`}>10</button>
          <button onClick={() => setNumToDisplay(20)} className={`h-12 px-4 bg-blue-500 text-white rounded-lg cursor-pointer transition-colors ${numToDisplay === 20 ? "bg-blue-800" : "hover:bg-blue-400"}`}>20</button>
          <button onClick={() => setNumToDisplay(30)} className={`h-12 px-4 bg-blue-500 text-white rounded-lg cursor-pointer transition-colors ${numToDisplay === 30 ? "bg-blue-800" : "hover:bg-blue-400"}`}>30</button>
          <button onClick={() => setNumToDisplay(40)} className={`h-12 px-4 bg-blue-500 text-white rounded-lg cursor-pointer transition-colors ${numToDisplay === 40 ? "bg-blue-800" : "hover:bg-blue-400"}`}>40</button>
          <button onClick={() => setNumToDisplay(50)} className={`h-12 px-4 bg-blue-500 text-white rounded-lg cursor-pointer transition-colors ${numToDisplay === 50 ? "bg-blue-800" : "hover:bg-blue-400"}`}>50</button>
        </div>
      </div>
      <div className="flex flex-col justify-start items-center space-y-3 w-full border-box p-4">
        {results === "loading" ? <Spinner color="#2563eb"/> : results.slice(0, numToDisplay).map((result, idx) => (
          <SearchResult result={result} key={idx} />
        ))}
      </div>
    </div>
  )
}
