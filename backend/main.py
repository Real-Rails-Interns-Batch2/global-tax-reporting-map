"""
Global Tax Reporting Map
FastAPI Backend · Real Rails Intelligence Library
Run: uvicorn main:app --reload --port 8000
"""

import json
import os
import csv
from typing import Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Global Tax Reporting API", version="1.0.0")

_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
ALLOWED_ORIGINS = [o.strip() for o in _origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Load countries from CSV ───────────────────────────────────────────────────
BASE_DIR     = os.path.dirname(os.path.abspath(__file__))
COUNTRIES_CSV = os.path.join(BASE_DIR, "data", "countries.csv")

def load_countries():
    countries = []
    try:
        with open(COUNTRIES_CSV, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                countries.append({
                    "name":              row["name"],
                    "status":            row["status"],
                    "adoptionYear":      int(row["adoptionYear"]),
                    "transparencyScore": int(row["transparencyScore"]),
                    "reportingRisk":     row["reportingRisk"],
                })
    except Exception as e:
        print(f"Error loading countries: {e}")
    return countries


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/countries")
def get_countries():
    return load_countries()


@app.get("/metrics")
def get_metrics():
    countries = load_countries()
    active      = [c for c in countries if c["status"] == "Active"]
    high_risk   = [c for c in countries if c["reportingRisk"] == "High"]
    avg_transparency = (
        sum(c["transparencyScore"] for c in countries) / len(countries)
        if countries else 0
    )
    return {
        "totalCountries":        len(countries),
        "activeParticipants":    len(active),
        "averageTransparency":   round(avg_transparency, 1),
        "highRiskJurisdictions": len(high_risk),
    }


@app.get("/countries/{name}")
def get_country(name: str):
    countries = load_countries()
    found = next((c for c in countries if c["name"].lower() == name.lower()), None)
    if not found:
        return {"error": "Country not found"}
    return found


@app.get("/countries/risk/{level}")
def get_by_risk(level: str):
    countries = load_countries()
    return [c for c in countries if c["reportingRisk"].lower() == level.lower()]


@app.get("/countries/status/{status}")
def get_by_status(status: str):
    countries = load_countries()
    return [c for c in countries if c["status"].lower() == status.lower()]


class Question(BaseModel):
    question: str

@app.post("/ask")
def ask_question(body: Question):
    # Simple rule based responses for now
    q = body.question.lower()
    response = ""

    if "crs" in q:
        response = "CRS stands for Common Reporting Standard. It is an OECD initiative requiring financial institutions to report account information of foreign tax residents to their local tax authority, which then exchanges this information with other countries."
    elif "high risk" in q or "risk" in q:
        response = "High risk jurisdictions are countries with low transparency scores and limited reporting compliance. Examples include Cayman Islands, Panama, and Bahamas which have transparency scores below 50."
    elif "oecd" in q:
        response = "The OECD (Organisation for Economic Co-operation and Development) developed the Common Reporting Standard in 2014. Over 100 countries have committed to implementing CRS for automatic exchange of financial account information."
    elif "fatca" in q:
        response = "FATCA (Foreign Account Tax Compliance Act) is a US law requiring foreign financial institutions to report information about accounts held by US taxpayers. It preceded CRS and inspired the global standard."
    elif "transparency" in q:
        response = "Transparency scores measure how openly a country shares financial account information. Higher scores indicate better compliance with international tax reporting standards."
    else:
        response = f"Your question about '{body.question}' relates to global tax reporting. The CRS network currently covers over 100 countries that automatically exchange financial account information to combat tax evasion."

    return {
        "agent_responses": {
            "Tax Intelligence Agent": response
        }
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "Global Tax Reporting API",
        "data_source": "countries.csv"
    }
