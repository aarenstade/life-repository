import re
from typing import Dict, Tuple, Optional, Union


class GeoDataParser:
    def __init__(self, data: Dict[str, str]):
        self.data = data

    def dms_to_decimal(
        self, degrees: float, minutes: float, seconds: float, direction: str
    ) -> float:
        decimal = degrees + minutes / 60 + seconds / 3600
        if direction in ["S", "W"]:
            decimal *= -1
        return decimal

    def parse_dms(self, dms_str: str) -> float:
        dms_pattern = re.compile(r'(\d+) deg (\d+)\' (\d+\.\d+)" ([NSEW])')
        match = dms_pattern.match(dms_str)
        if not match:
            raise ValueError(f"Invalid DMS format: {dms_str}")
        degrees, minutes, seconds, direction = match.groups()
        return self.dms_to_decimal(
            float(degrees), float(minutes), float(seconds), direction
        )

    def parse_decimal(self, decimal_str: str) -> float:
        try:
            return float(decimal_str)
        except ValueError:
            raise ValueError(f"Invalid decimal format: {decimal_str}")

    def parse_altitude(self, altitude_str: str) -> Tuple[float, str]:
        altitude_pattern = re.compile(r"(\d+\.\d+) (\w+)")
        match = altitude_pattern.match(altitude_str)
        if not match:
            raise ValueError(f"Invalid altitude format: {altitude_str}")
        altitude, unit = match.groups()
        return float(altitude), unit

    def parse_latitude(self) -> float:
        latitude_str = self.data.get("latitude")
        if "deg" in latitude_str:
            return self.parse_dms(latitude_str)
        return self.parse_decimal(latitude_str)

    def parse_longitude(self) -> float:
        longitude_str = self.data.get("longitude")
        if "deg" in longitude_str:
            return self.parse_dms(longitude_str)
        return self.parse_decimal(longitude_str)

    def parse_altitude_data(self) -> Tuple[float, str]:
        altitude_str = self.data.get("altitude")
        return self.parse_altitude(altitude_str)

    def convert_geo_data(self) -> Dict[str, Union[float, str]]:
        latitude = self.parse_latitude()
        longitude = self.parse_longitude()
        altitude, altitude_unit = self.parse_altitude_data()
        return {
            "latitude": latitude,
            "longitude": longitude,
            "altitude": altitude,
            "altitude_unit": altitude_unit,
        }
