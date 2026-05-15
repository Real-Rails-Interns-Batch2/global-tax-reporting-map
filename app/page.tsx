"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import axios from "axios";

import { countries } from "./data/countries";

const WorldMap = dynamic(
  () => import("./components/WorldMap"),
  {
    ssr: false,
  }
);

export default function Home() {

  const [countryData, setCountryData] = useState(countries);

  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

  const [search, setSearch] = useState("");

  const [compareCountry, setCompareCountry] = useState(countries[1]);

  const [question, setQuestion] = useState("");

  const [aiResults, setAiResults] = useState<
    Record<string, string>
  >({});

  const [metrics, setMetrics] = useState({
    totalCountries: 0,
    activeParticipants: 0,
    averageTransparency: 0,
    highRiskJurisdictions: 0,
  });

  useEffect(() => {

    axios
      .get("http://127.0.0.1:8000/countries")
      .then((response) => {

        setCountryData(response.data);

        setSelectedCountry(response.data[0]);

      })
      .catch((error) => {

        console.error(error);

      });

    axios
      .get("http://127.0.0.1:8000/metrics")
      .then((response) => {

        setMetrics(response.data);

      })
      .catch((error) => {

        console.error(error);

      });

  }, []);

  const askAI = async () => {

    try {

      const response = await axios.post(
        "http://127.0.0.1:8000/ask",
        {
          question,
        }
      );

      setAiResults(
        response.data.agent_responses || {}
      );

    } catch (error) {

      console.error(error);

    }
  };

  const filteredCountries = countryData.filter(
    (country) =>
      country.name
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (

    <main className="min-h-screen bg-[#030712] text-white">

      <div className="flex h-screen">

        {/* LEFT SECTION */}
        <section className="w-[70%] border-r border-[#1F2937] p-6 overflow-y-auto">

          <h1 className="text-3xl font-semibold text-cyan-400">
            Global Tax Reporting Map
          </h1>

          {/* METRICS */}
          <div className="mt-6 grid grid-cols-4 gap-4">

            <div className="rounded-2xl border border-[#1F2937] bg-[#0B1117] p-4">

              <p className="text-xs uppercase tracking-wide text-gray-500">
                Total Countries
              </p>

              <p className="mt-2 text-2xl font-semibold text-cyan-400">
                {metrics.totalCountries}
              </p>

            </div>

            <div className="rounded-2xl border border-[#1F2937] bg-[#0B1117] p-4">

              <p className="text-xs uppercase tracking-wide text-gray-500">
                Active Participants
              </p>

              <p className="mt-2 text-2xl font-semibold text-indigo-400">
                {metrics.activeParticipants}
              </p>

            </div>

            <div className="rounded-2xl border border-[#1F2937] bg-[#0B1117] p-4">

              <p className="text-xs uppercase tracking-wide text-gray-500">
                Avg Transparency
              </p>

              <p className="mt-2 text-2xl font-semibold text-cyan-400">
                {metrics.averageTransparency}
              </p>

            </div>

            <div className="rounded-2xl border border-[#1F2937] bg-[#0B1117] p-4">

              <p className="text-xs uppercase tracking-wide text-gray-500">
                High Risk
              </p>

              <p className="mt-2 text-2xl font-semibold text-red-400">
                {metrics.highRiskJurisdictions}
              </p>

            </div>

          </div>

          {/* AI SEARCH */}
          <div className="mt-6 rounded-2xl border border-[#1F2937] bg-[#0B1117] p-4">

            <h2 className="text-lg font-semibold text-cyan-400">
              AI Tax Intelligence
            </h2>

            <div className="mt-4 flex gap-3">

              <input
                type="text"
                placeholder="Ask AI about CRS..."
                value={question}
                onChange={(e) =>
                  setQuestion(e.target.value)
                }
                className="flex-1 rounded-xl border border-[#1F2937] bg-[#030712] px-4 py-3 text-white outline-none focus:border-cyan-400"
              />

              <button
                onClick={askAI}
                className="rounded-xl bg-cyan-500 px-6 py-3 font-medium text-black hover:bg-cyan-400 transition"
              >
                Ask
              </button>

            </div>

            {/* AI RESULTS */}
            <div className="mt-4 space-y-4">

              {Object.entries(aiResults || {}).map(
                ([agent, result]) => (

                  <div
                    key={agent}
                    className="rounded-xl border border-[#1F2937] bg-[#030712] p-4"
                  >

                    <h3 className="mb-2 text-sm font-semibold text-cyan-400">
                      {agent}
                    </h3>

                    <p className="text-sm text-gray-300 whitespace-pre-wrap">
                      {String(result)}
                    </p>

                  </div>

                )
              )}

            </div>

          </div>

          {/* MAP */}
          <div className="mt-6 h-[70vh] rounded-2xl border border-[#1F2937] bg-[#0B1117] overflow-hidden">

            <WorldMap
              onSelectCountry={(countryName) => {

                const foundCountry = countryData.find(
                  (c) => c.name === countryName
                );

                if (foundCountry) {
                  setSelectedCountry(foundCountry);
                }

              }}
            />

          </div>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search countries..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="mt-4 w-full rounded-xl border border-[#1F2937] bg-[#0B1117] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
          />

          {/* COUNTRY BUTTONS */}
          <div className="mt-4 flex flex-wrap gap-3">

            {filteredCountries.map((country) => (

              <button
                key={country.name}
                onClick={() =>
                  setSelectedCountry(country)
                }
                className="rounded-lg border border-cyan-500 px-4 py-2 text-sm text-cyan-400 hover:bg-cyan-500 hover:text-black transition"
              >
                {country.name}
              </button>

            ))}

          </div>

          {/* COMPARISON */}
          <select
            value={compareCountry.name}
            onChange={(e) => {

              const found = countryData.find(
                (c) => c.name === e.target.value
              );

              if (found) {
                setCompareCountry(found);
              }

            }}
            className="mt-4 rounded-xl border border-[#1F2937] bg-[#0B1117] px-4 py-3 text-white"
          >

            {countryData.map((country) => (

              <option
                key={country.name}
                value={country.name}
              >
                Compare with {country.name}
              </option>

            ))}

          </select>

        </section>

        {/* RIGHT SIDEBAR */}
        <aside className="w-[30%] p-6 overflow-y-auto">

          <div className="rounded-2xl border border-[#1F2937] bg-[#0B1117] p-6">

            <h2 className="text-xl font-semibold text-cyan-400">
              {selectedCountry.name}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              CRS Status
            </p>

            <p className="text-lg text-white">
              {selectedCountry.status}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4">

              <div className="rounded-xl border border-[#1F2937] bg-[#030712] p-4">

                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Adoption Year
                </p>

                <p className="mt-2 text-lg text-white">
                  {selectedCountry.adoptionYear}
                </p>

              </div>

              <div className="rounded-xl border border-[#1F2937] bg-[#030712] p-4">

                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Transparency
                </p>

                <p className="mt-2 text-lg text-cyan-400">
                  {selectedCountry.transparencyScore}
                </p>

              </div>

            </div>

            <div className="mt-4 rounded-xl border border-[#1F2937] bg-[#030712] p-4">

              <p className="text-xs uppercase tracking-wide text-gray-500">
                Reporting Risk
              </p>

              <p className="mt-2 text-lg text-indigo-400">
                {selectedCountry.reportingRisk}
              </p>

            </div>

          </div>

        </aside>

      </div>

    </main>

  );
}