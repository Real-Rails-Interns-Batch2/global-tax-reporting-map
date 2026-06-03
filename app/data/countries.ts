// app/data/countries.ts
// Country data for Global Tax Reporting Map

export type CountryStatus = "Active" | "Partial" | "Pending" | "Non-Participant";
export type RiskLevel     = "Low" | "Medium" | "High";

export type Country = {
  name: string;
  status: string;
  adoptionYear: number;
  transparencyScore: number;
  reportingRisk: string;
  region: string;
  lat: number;
  lng: number;
};

export const countries: Country[] = [
  { name: "Singapore",            status: "Active",  adoptionYear: 2018, transparencyScore: 92, reportingRisk: "Low",    region: "Asia",          lat: 1.3521,   lng: 103.8198  },
  { name: "United Kingdom",       status: "Active",  adoptionYear: 2016, transparencyScore: 95, reportingRisk: "Low",    region: "Europe",        lat: 55.3781,  lng: -3.4360   },
  { name: "Germany",              status: "Active",  adoptionYear: 2017, transparencyScore: 94, reportingRisk: "Low",    region: "Europe",        lat: 51.1657,  lng: 10.4515   },
  { name: "Cayman Islands",       status: "Partial", adoptionYear: 2018, transparencyScore: 45, reportingRisk: "High",   region: "Caribbean",     lat: 19.3133,  lng: -81.2546  },
  { name: "United States",        status: "Active",  adoptionYear: 2014, transparencyScore: 88, reportingRisk: "Medium", region: "North America", lat: 37.0902,  lng: -95.7129  },
  { name: "Canada",               status: "Active",  adoptionYear: 2017, transparencyScore: 90, reportingRisk: "Low",    region: "North America", lat: 56.1304,  lng: -106.3468 },
  { name: "France",               status: "Active",  adoptionYear: 2016, transparencyScore: 89, reportingRisk: "Low",    region: "Europe",        lat: 46.2276,  lng: 2.2137    },
  { name: "Australia",            status: "Active",  adoptionYear: 2017, transparencyScore: 91, reportingRisk: "Low",    region: "Oceania",       lat: -25.2744, lng: 133.7751  },
  { name: "Japan",                status: "Active",  adoptionYear: 2018, transparencyScore: 87, reportingRisk: "Low",    region: "Asia",          lat: 36.2048,  lng: 138.2529  },
  { name: "China",                status: "Active",  adoptionYear: 2018, transparencyScore: 72, reportingRisk: "Medium", region: "Asia",          lat: 35.8617,  lng: 104.1954  },
  { name: "India",                status: "Active",  adoptionYear: 2017, transparencyScore: 70, reportingRisk: "Medium", region: "Asia",          lat: 20.5937,  lng: 78.9629   },
  { name: "Brazil",               status: "Active",  adoptionYear: 2018, transparencyScore: 68, reportingRisk: "Medium", region: "South America", lat: -14.2350, lng: -51.9253  },
  { name: "United Arab Emirates", status: "Partial", adoptionYear: 2018, transparencyScore: 60, reportingRisk: "Medium", region: "Middle East",   lat: 23.4241,  lng: 53.8478   },
  { name: "Switzerland",          status: "Active",  adoptionYear: 2017, transparencyScore: 85, reportingRisk: "Medium", region: "Europe",        lat: 46.8182,  lng: 8.2275    },
  { name: "Luxembourg",           status: "Active",  adoptionYear: 2017, transparencyScore: 86, reportingRisk: "Medium", region: "Europe",        lat: 49.8153,  lng: 6.1296    },
  { name: "Panama",               status: "Partial", adoptionYear: 2018, transparencyScore: 45, reportingRisk: "High",   region: "Central America",lat: 8.5380,  lng: -80.7821  },
  { name: "Bahamas",              status: "Partial", adoptionYear: 2018, transparencyScore: 40, reportingRisk: "High",   region: "Caribbean",     lat: 25.0343,  lng: -77.3963  },
  { name: "Hong Kong",            status: "Active",  adoptionYear: 2018, transparencyScore: 74, reportingRisk: "Medium", region: "Asia",          lat: 22.3193,  lng: 114.1694  },
  { name: "South Korea",          status: "Active",  adoptionYear: 2017, transparencyScore: 88, reportingRisk: "Low",    region: "Asia",          lat: 35.9078,  lng: 127.7669  },
  { name: "Netherlands",          status: "Active",  adoptionYear: 2016, transparencyScore: 90, reportingRisk: "Low",    region: "Europe",        lat: 52.1326,  lng: 5.2913    },
  { name: "Ireland",              status: "Active",  adoptionYear: 2016, transparencyScore: 89, reportingRisk: "Low",    region: "Europe",        lat: 53.1424,  lng: -7.6921   },
  { name: "Norway",               status: "Active",  adoptionYear: 2016, transparencyScore: 93, reportingRisk: "Low",    region: "Europe",        lat: 60.4720,  lng: 8.4689    },
  { name: "Sweden",               status: "Active",  adoptionYear: 2016, transparencyScore: 94, reportingRisk: "Low",    region: "Europe",        lat: 60.1282,  lng: 18.6435   },
  { name: "South Africa",         status: "Active",  adoptionYear: 2017, transparencyScore: 69, reportingRisk: "Medium", region: "Africa",        lat: -30.5595, lng: 22.9375   },
];
