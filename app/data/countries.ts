// app/data/countries.ts
// Country data for Global Tax Reporting Map
// Fields: name, status, adoptionYear, transparencyScore, reportingRisk,
//         region, reportingTo, lat, lng

export type CountryStatus = "Active" | "Adopted" | "Pending" | "Non-Participant";
export type RiskLevel     = "Low" | "Medium" | "High";

export const countries = [

  {
    name: "Singapore",
    status: "Active",
    adoptionYear: 2018,
    transparencyScore: 92,
    reportingRisk: "Low",
  },

  {
    name: "United Kingdom",
    status: "Active",
    adoptionYear: 2016,
    transparencyScore: 95,
    reportingRisk: "Low",
  },

  {
    name: "Germany",
    status: "Active",
    adoptionYear: 2017,
    transparencyScore: 94,
    reportingRisk: "Low",
  },

  {
    name: "Cayman Islands",
    status: "Partial",
    adoptionYear: 2018,
    transparencyScore: 45,
    reportingRisk: "High",
  },

  {
    name: "United States",
    status: "Active",
    adoptionYear: 2014,
    transparencyScore: 88,
    reportingRisk: "Medium",
  },

  {
    name: "Canada",
    status: "Active",
    adoptionYear: 2017,
    transparencyScore: 90,
    reportingRisk: "Low",
  },

  {
    name: "France",
    status: "Active",
    adoptionYear: 2016,
    transparencyScore: 89,
    reportingRisk: "Low",
  },

  {
    name: "Australia",
    status: "Active",
    adoptionYear: 2017,
    transparencyScore: 91,
    reportingRisk: "Low",
  },

  {
    name: "Japan",
    status: "Active",
    adoptionYear: 2018,
    transparencyScore: 87,
    reportingRisk: "Low",
  },

  {
    name: "China",
    status: "Active",
    adoptionYear: 2018,
    transparencyScore: 72,
    reportingRisk: "Medium",
  },

  {
    name: "India",
    status: "Active",
    adoptionYear: 2017,
    transparencyScore: 70,
    reportingRisk: "Medium",
  },

  {
    name: "Brazil",
    status: "Active",
    adoptionYear: 2018,
    transparencyScore: 68,
    reportingRisk: "Medium",
  },

  {
    name: "United Arab Emirates",
    status: "Partial",
    adoptionYear: 2018,
    transparencyScore: 60,
    reportingRisk: "Medium",
  },

  {
    name: "Switzerland",
    status: "Active",
    adoptionYear: 2017,
    transparencyScore: 85,
    reportingRisk: "Medium",
  },

  {
    name: "Luxembourg",
    status: "Active",
    adoptionYear: 2017,
    transparencyScore: 86,
    reportingRisk: "Medium",
  },

  {
    name: "Panama",
    status: "Partial",
    adoptionYear: 2018,
    transparencyScore: 45,
    reportingRisk: "High",
  },

  {
    name: "Bahamas",
    status: "Partial",
    adoptionYear: 2018,
    transparencyScore: 40,
    reportingRisk: "High",
  },

  {
    name: "Hong Kong",
    status: "Active",
    adoptionYear: 2018,
    transparencyScore: 74,
    reportingRisk: "Medium",
  },

  {
    name: "South Korea",
    status: "Active",
    adoptionYear: 2017,
    transparencyScore: 88,
    reportingRisk: "Low",
  },

  {
    name: "Netherlands",
    status: "Active",
    adoptionYear: 2016,
    transparencyScore: 90,
    reportingRisk: "Low",
  },

  {
    name: "Ireland",
    status: "Active",
    adoptionYear: 2016,
    transparencyScore: 89,
    reportingRisk: "Low",
  },

  {
    name: "Norway",
    status: "Active",
    adoptionYear: 2016,
    transparencyScore: 93,
    reportingRisk: "Low",
  },

  {
    name: "Sweden",
    status: "Active",
    adoptionYear: 2016,
    transparencyScore: 94,
    reportingRisk: "Low",
  },

  {
    name: "South Africa",
    status: "Active",
    adoptionYear: 2017,
    transparencyScore: 69,
    reportingRisk: "Medium",
  },

];