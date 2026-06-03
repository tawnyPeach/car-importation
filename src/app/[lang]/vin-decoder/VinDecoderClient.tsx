"use client";

import { useState } from "react";

interface VinResult {
  make: string;
  model: string;
  year: string;
  engine: string;
  fuelType: string;
  driveType: string;
  bodyClass: string;
}

export default function VinDecoderClient({ lang }: { lang: string }) {
  const [vin, setVin] = useState("");
  const [result, setResult] = useState<VinResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDecode = async () => {
    const trimmedVin = vin.trim().toUpperCase();

    if (trimmedVin.length !== 17) {
      setError(
        lang === "fr"
          ? "Le VIN doit contenir exactement 17 caracteres."
          : "VIN must be exactly 17 characters."
      );
      setResult(null);
      return;
    }

    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(trimmedVin)) {
      setError(
        lang === "fr"
          ? "Le VIN contient des caracteres invalides. Les lettres I, O et Q ne sont pas autorisees."
          : "VIN contains invalid characters. Letters I, O, and Q are not allowed."
      );
      setResult(null);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${trimmedVin}?format=json`
      );

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      const results = data.Results as Array<{
        Variable: string;
        Value: string | null;
      }>;

      const getValue = (variable: string): string => {
        const item = results.find((r) => r.Variable === variable);
        return item?.Value && item.Value.trim() !== "" ? item.Value.trim() : "N/A";
      };

      const make = getValue("Make");
      const model = getValue("Model");

      if (make === "N/A" && model === "N/A") {
        setError(
          lang === "fr"
            ? "VIN invalide ou non reconnu. Veuillez verifier et reessayer."
            : "Invalid or unrecognized VIN. Please check and try again."
        );
        return;
      }

      setResult({
        make,
        model,
        year: getValue("Model Year"),
        engine: getValue("Engine Number of Cylinders") !== "N/A"
          ? `${getValue("Engine Number of Cylinders")} cyl - ${getValue("Displacement (L)")}L`
          : getValue("Displacement (L)") !== "N/A"
          ? `${getValue("Displacement (L)")}L`
          : "N/A",
        fuelType: getValue("Fuel Type - Primary"),
        driveType: getValue("Drive Type"),
        bodyClass: getValue("Body Class"),
      });
    } catch {
      setError(
        lang === "fr"
          ? "Erreur lors du decodage. Veuillez reessayer."
          : "Error decoding VIN. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getFuelTypeParam = (): string => {
    if (!result) return "petrol";
    const fuel = result.fuelType.toLowerCase();
    if (fuel.includes("diesel")) return "diesel";
    return "petrol";
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={vin}
            onChange={(e) => setVin(e.target.value.toUpperCase())}
            placeholder={
              lang === "fr"
                ? "Entrez le VIN (17 caracteres)"
                : "Enter VIN (17 characters)"
            }
            maxLength={17}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-lg font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent"
          />
          <button
            onClick={handleDecode}
            disabled={loading}
            className="px-8 py-3 bg-[#10b981] text-white font-semibold rounded-lg hover:bg-[#059669] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? lang === "fr"
                ? "Decodage..."
                : "Decoding..."
              : lang === "fr"
              ? "Decoder"
              : "Decode"}
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          {lang === "fr"
            ? `${vin.length}/17 caracteres`
            : `${vin.length}/17 characters`}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-[#1a1f36] mb-4">
            {lang === "fr" ? "Resultats du decodage" : "Decode Results"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-500">
                {lang === "fr" ? "Marque" : "Make"}
              </span>
              <p className="font-semibold text-[#1a1f36]">{result.make}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-500">
                {lang === "fr" ? "Modele" : "Model"}
              </span>
              <p className="font-semibold text-[#1a1f36]">{result.model}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-500">
                {lang === "fr" ? "Annee" : "Year"}
              </span>
              <p className="font-semibold text-[#1a1f36]">{result.year}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-500">
                {lang === "fr" ? "Moteur" : "Engine"}
              </span>
              <p className="font-semibold text-[#1a1f36]">{result.engine}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-500">
                {lang === "fr" ? "Carburant" : "Fuel Type"}
              </span>
              <p className="font-semibold text-[#1a1f36]">{result.fuelType}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-500">
                {lang === "fr" ? "Transmission" : "Drive Type"}
              </span>
              <p className="font-semibold text-[#1a1f36]">{result.driveType}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg md:col-span-2">
              <span className="text-sm text-gray-500">
                {lang === "fr" ? "Type de carrosserie" : "Body Class"}
              </span>
              <p className="font-semibold text-[#1a1f36]">{result.bodyClass}</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-[#f0fdf4] border border-[#10b981] rounded-lg">
            <p className="text-sm text-gray-700 mb-2">
              {lang === "fr"
                ? "Calculez le cout d'importation pour ce vehicule :"
                : "Calculate the import cost for this vehicle:"}
            </p>
            <a
              href={`/${lang}/calculator?fuel=${getFuelTypeParam()}`}
              className="inline-block px-6 py-2 bg-[#f59e0b] text-white font-semibold rounded-lg hover:bg-[#d97706] transition"
            >
              {lang === "fr"
                ? "Calculer le cout d'importation"
                : "Calculate import cost for this vehicle"}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
