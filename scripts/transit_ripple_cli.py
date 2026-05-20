import json
import sys
from dataclasses import asdict
from astrolife_transit_ripple_v4 import run_transit_ripple_engine_v4

def main():
    try:
        raw = sys.stdin.read()
        data = json.loads(raw)

        report = run_transit_ripple_engine_v4(
            native_name=data.get("nativeName", "AstroLife Native"),
            ascendant=data["ascendant"],
            moon_sign=data.get("moonSign"),
            transit_planet=data["transitPlanet"],
            transit_sign=data["transitSign"],
            transit_nakshatra=data["transitNakshatra"],
            transit_speed=data.get("transitSpeed", "direct"),
            current_mahadasha=data.get("currentMahadasha"),
            current_antardasha=data.get("currentAntardasha"),
            period_label=data.get("periodLabel", "Current transit activation period"),
            include_moon_sign_reading=data.get("includeMoonSignReading", True),
        )

        print(json.dumps(asdict(report), ensure_ascii=False))

    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": str(e)
        }, ensure_ascii=False))
        sys.exit(1)

if __name__ == "__main__":
    main()
