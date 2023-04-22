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

const SearchResult = ({ result }) => (
  <div className="flex flex-row w-full h-full items-center justify-between border rounded-md p-4 shadow-md gap-8">
    <Image alt="podcast cover image" className="overflow-hidden" src="/tafs.jpg" width={250} height={250} />
    <div className="flex flex-col w-full">
      <h2 className={`${concert.className} text-3xl text-center`}>{result.episode_title}</h2>
      <h3 className={`font-mono text-sm text-center mb-2`}>{formatDate(result.episode_date)} — {secondsToTimestamp(result.timestamp)}</h3>
      <p className={`${raleway.className} text-sm`}>{result.text + " [...]"}</p>
    </div>
  </div>
)

const dummyResult = {
  episode_title: "Joe Rogan Experience #1440 - Elon Musk",
  episode_date: "2021-03-05",
  timestamp: "00:00:00",
  text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
}

export default function Home() {
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  const semanticSearch = async (e) => {
    e.preventDefault();
    setResults("loading");
    let query = inputRef.current.value;
    let response = await fetch(`/api/search?query=${encodeURIComponent(query)}`).then((res) => res.json());
    setResults(response.results);
  }

  return (
    <div className="w-full h-full py-4 space-y-4 flex items-center justify-start flex-col">
      <h1 className={`${concert.className} text-5xl text-center`}>TAFSearch</h1>
      <form className="flex w-full items-center justify-center space-x-4" onSubmit={semanticSearch}>
        <input ref={inputRef} className={`w-3/4 h-12 px-4 border-2 border-gray-300 rounded-lg ${raleway.className}`} placeholder="Search for a podcast" />
        <button type="submit" className="h-12 px-4 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-400 transition-colors">Search</button>
      </form>
      <div className="flex flex-col justify-start items-center space-y-3 w-full border-box px-4">
        {results === "loading" ? <Spinner color="#2563eb"/> : results.map((result, idx) => (
          <SearchResult result={result} key={idx} />
        ))}
      </div>
    </div>
  )
}
