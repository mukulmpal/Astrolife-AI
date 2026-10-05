"use client";

import { useEffect, useState } from "react";
import { X, Edit3, Save, MapPin, Calendar, Clock, User, AlertCircle } from "lucide-react";
import CityAutocomplete, { type CitySearchResult } from "@/components/location/CityAutocomplete";
import { updateSavedChart, ianaToUtcOffset, saveCurrentChart, useUserChart, type ChartData } from "@/lib/user-chart";

export type EditableChartData = {
  id: string;
  name: string;
  gender?: string | null;
  birth_date?: string;
  dob?: string;
  birth_time?: string;
  tob?: string;
  birth_place?: string;
  city?: string;
  latitude?: number | null;
  lat?: number | null;
  longitude?: number | null;
  lon?: number | null;
  timezone?: string | null;
  tz?: number | null;
};

type Props = {
  isOpen: boolean;
  chart: EditableChartData | null;
  onClose: () => void;
  onSaved: (updatedChart: ChartData, chartId: string) => void;
};

export default function EditChartModal({ isOpen, chart, onClose, onSaved }: Props) {
  const { setChartData, chart: activeChart } = useUserChart();

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");
  const [cityName, setCityName] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [tz, setTz] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<CitySearchResult | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!chart || !isOpen) return;

    setName(chart.name || "");
    setGender(chart.gender || "Male");
    setDob(chart.birth_date || chart.dob || "");
    setTob((chart.birth_time || chart.tob || "").slice(0, 5));
    
    const initialCity = chart.birth_place || chart.city || "";
    setCityName(initialCity);

    const initialLat = chart.latitude ?? chart.lat ?? null;
    const initialLon = chart.longitude ?? chart.lon ?? null;
    setLat(initialLat);
    setLon(initialLon);

    let initialTz: number | null = null;
    if (typeof chart.tz === "number") {
      initialTz = chart.tz;
    } else if (chart.timezone) {
      const parsed = parseFloat(chart.timezone);
      initialTz = !isNaN(parsed) ? parsed : 5.5;
    } else {
      initialTz = 5.5;
    }
    setTz(initialTz);

    if (initialCity && initialLat !== null && initialLon !== null) {
      setSelectedCity({
        geonameId: 0,
        name: initialCity,
        asciiName: initialCity,
        countryCode: "IN",
        admin1: null,
        latitude: initialLat,
        longitude: initialLon,
        timezone: null,
        population: 0,
        displayName: initialCity,
      });
    } else {
      setSelectedCity(null);
    }

    setError("");
    setSaving(false);
  }, [chart, isOpen]);

  if (!isOpen || !chart) return null;

  const handleCitySelect = (city: CitySearchResult | null) => {
    setSelectedCity(city);
    if (city) {
      setCityName(city.displayName);
      setLat(city.latitude);
      setLon(city.longitude);
      const computedTz = ianaToUtcOffset(city.timezone, dob, tob);
      setTz(computedTz);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter a valid name.");
      return;
    }
    if (!dob) {
      setError("Please select a birth date.");
      return;
    }
    if (!tob) {
      setError("Please enter birth time.");
      return;
    }
    if (!cityName.trim()) {
      setError("Please enter or select a birth city.");
      return;
    }

    setSaving(true);

    try {
      const result = await updateSavedChart(chart.id, {
        name: name.trim(),
        gender: gender || null,
        dob,
        tob,
        city: cityName.trim(),
        lat: lat ?? undefined,
        lon: lon ?? undefined,
        tz: tz ?? 5.5,
      });

      if (!result.ok || !result.chart) {
        throw new Error(result.error || "Failed to update chart details.");
      }

      // Check if this chart was active, or automatically update active chart
      const isCurrentlyActive =
        activeChart &&
        (activeChart.name.toLowerCase() === chart.name.toLowerCase() ||
          activeChart.name.toLowerCase() === name.trim().toLowerCase());

      if (isCurrentlyActive) {
        setChartData(result.chart);
        saveCurrentChart(result.chart);
      }

      onSaved(result.chart, chart.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update chart.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        background: "rgba(10, 10, 10, 0.65)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "#FFFFFF",
          borderRadius: "20px",
          border: "1px solid rgba(184, 134, 11, 0.28)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(184, 134, 11, 0.1)",
          overflow: "hidden",
          animation: "modalFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 24px",
            borderBottom: "1px solid rgba(184, 134, 11, 0.16)",
            background: "linear-gradient(180deg, #FBF8F2 0%, #FFFFFF 100%)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(184, 134, 11, 0.12)",
                color: "#B8860B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Edit3 size={18} />
            </div>
            <div>
              <h2
                className="serif"
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#1A1A1A",
                  margin: 0,
                }}
              >
                Edit Saved Kundli
              </h2>
              <div style={{ fontSize: "12px", color: "#6B635B", marginTop: "2px" }}>
                Update birth information and recalculate planetary placements
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: 0,
              color: "#6B635B",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} style={{ padding: "20px 24px" }}>
          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 14px",
                borderRadius: "8px",
                background: "rgba(220, 38, 38, 0.08)",
                border: "1px solid rgba(220, 38, 38, 0.2)",
                color: "#DC2626",
                fontSize: "13px",
                marginBottom: "16px",
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div style={{ display: "grid", gap: "16px" }}>
            {/* Full Name & Gender */}
            <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "12px" }}>
              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#4A4238",
                    marginBottom: "6px",
                  }}
                >
                  <User size={13} color="#B8860B" /> Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  required
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "1px solid rgba(184, 134, 11, 0.25)",
                    fontSize: "14px",
                    background: "#FAF8F5",
                    color: "#1A1A1A",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#4A4238",
                    marginBottom: "6px",
                  }}
                >
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "1px solid rgba(184, 134, 11, 0.25)",
                    fontSize: "14px",
                    background: "#FAF8F5",
                    color: "#1A1A1A",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Date of Birth & Time of Birth */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#4A4238",
                    marginBottom: "6px",
                  }}
                >
                  <Calendar size={13} color="#B8860B" /> Date of Birth
                </label>
                <input
                  type="date"
                  value={dob}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => {
                    const newDob = e.target.value;
                    setDob(newDob);
                    if (selectedCity?.timezone) {
                      setTz(ianaToUtcOffset(selectedCity.timezone, newDob, tob));
                    }
                  }}
                  required
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "1px solid rgba(184, 134, 11, 0.25)",
                    fontSize: "14px",
                    background: "#FAF8F5",
                    color: "#1A1A1A",
                    outline: "none",
                    boxSizing: "border-box",
                    colorScheme: "light",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#4A4238",
                    marginBottom: "6px",
                  }}
                >
                  <Clock size={13} color="#B8860B" /> Time of Birth
                </label>
                <input
                  type="time"
                  value={tob}
                  onChange={(e) => {
                    const newTob = e.target.value;
                    setTob(newTob);
                    if (selectedCity?.timezone) {
                      setTz(ianaToUtcOffset(selectedCity.timezone, dob, newTob));
                    }
                  }}
                  required
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "1px solid rgba(184, 134, 11, 0.25)",
                    fontSize: "14px",
                    background: "#FAF8F5",
                    color: "#1A1A1A",
                    outline: "none",
                    boxSizing: "border-box",
                    colorScheme: "light",
                  }}
                />
              </div>
            </div>

            {/* Birth City Autocomplete */}
            <div>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#4A4238",
                  marginBottom: "6px",
                }}
              >
                <MapPin size={13} color="#B8860B" /> Birth City & Location
              </label>
              <CityAutocomplete
                label=""
                value={selectedCity}
                placeholder="Search city, e.g. Delhi, Mumbai, London"
                onChange={handleCitySelect}
              />

              {/* Coordinates Preview */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "6px",
                  fontSize: "11px",
                  color: "#6B635B",
                  padding: "4px 8px",
                  background: "rgba(184, 134, 11, 0.05)",
                  borderRadius: "6px",
                }}
              >
                <span>
                  Coordinates:{" "}
                  {lat !== null && lon !== null
                    ? `${Number(lat).toFixed(2)}°, ${Number(lon).toFixed(2)}°`
                    : "Automatic GPS"}
                </span>
                <span>Timezone: UTC {tz !== null && tz >= 0 ? `+${tz}` : tz}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "24px",
              paddingTop: "16px",
              borderTop: "1px solid rgba(184, 134, 11, 0.14)",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                background: "transparent",
                border: "1px solid rgba(184, 134, 11, 0.25)",
                color: "#4A4238",
                fontWeight: 600,
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "8px",
                background: "#B8860B",
                border: 0,
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "13px",
                cursor: saving ? "wait" : "pointer",
                boxShadow: "0 2px 8px rgba(184, 134, 11, 0.3)",
              }}
            >
              <Save size={15} />
              {saving ? "Saving & Calculating..." : "Save & Recalculate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
