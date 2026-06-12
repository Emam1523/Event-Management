import { useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { FiCrosshair } from 'react-icons/fi';

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '1rem'
};

const defaultCenter = {
  lat: 23.8103, 
  lng: 90.4125
};

const MapPicker = ({ value, onChange }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  let marker = null;
  if (value) {
    try {
      const [latStr, lngStr] = value.split(',');
      const lat = Number(latStr);
      const lng = Number(lngStr);
      if (!isNaN(lat) && !isNaN(lng)) {
        marker = { lat, lng };
      }
    } catch {
      // invalid format
    }
  }

  const center = marker || defaultCenter;

  const onMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    onChange(`${lat},${lng}`);
  }, [onChange]);

  const getCurrentLocation = (e) => {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          onChange(`${lat},${lng}`);
        },
        () => {
          alert("Error: The Geolocation service failed.");
        }
      );
    } else {
      alert("Error: Your browser doesn't support geolocation.");
    }
  };

  return isLoaded ? (
    <div className="relative border border-white/10 rounded-2xl overflow-hidden group">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onClick={onMapClick}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        {marker && <Marker position={marker} />}
      </GoogleMap>
      <button
        onClick={getCurrentLocation}
        className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-full text-white hover:text-orange-500 hover:bg-black/80 transition-all shadow-xl flex items-center justify-center z-10"
        title="Get Live Location"
      >
        <FiCrosshair className="text-xl" />
      </button>
      {!marker && (
         <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg text-[10px] font-black text-white tracking-widest pointer-events-none">
           CLICK MAP TO SET PIN
         </div>
      )}
    </div>
  ) : (
    <div className="w-full h-[300px] bg-white/5 rounded-2xl flex items-center justify-center text-zinc-500 border border-white/5">
      <div className="w-8 h-8 border-2 border-zinc-500 border-t-orange-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default MapPicker;
