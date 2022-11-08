import React from 'react';
import './Map.css';
import { nanoid } from 'nanoid';
import { Map, Marker, Overlay, ZoomControl } from 'pigeon-maps';
import { useState } from 'react';
import Editor from './Editor';
import { doc, deleteDoc } from 'firebase/firestore';
import Popup from './Popup';
import { useEffect } from 'react';

function MyMap({
  markers,
  setMarkers,
  addMarker,
  isLogged,
  userId,
  storage,
  db,
  setIsCommentsOpen,
  setCurMarkerDoc,
}) {
  const [isMarkerClicked, setIsMarkerClicked] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [curDoc, setCurDoc] = useState();
  const [anchor, setAnchor] = useState([]);
  const [clickedMarker, setClickedMarker] = useState();
  const [geo, setGeo] = useState(undefined);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((pos) =>
        setGeo([pos.coords.latitude, pos.coords.longitude])
      );
    }
  }, []);

  const handleE = (e) => {
    if (isMarkerClicked) {
      setIsMarkerClicked(false);
      setIsCommentsOpen(false);
      return;
    }
    if (!isLogged) {
      alert('Please Log in');
      return;
    }
    if (isEditorOpen) return;
    const [lat, lng] = e.latLng;
    const id = nanoid();
    setMarkers((prev) => [...prev, { lat, lng, id, userId, comments: [] }]);
    addMarker(lat, lng, id, userId);
    setIsEditorOpen(true);
    setCurDoc(doc(db, 'marker', `${id}`));
  };

  const handleClick = (e) => {
    if (isMarkerClicked) {
      setIsMarkerClicked(false);
      return;
    }
    setAnchor(e.anchor);
    setIsMarkerClicked(true);
    setCurMarkerDoc(doc(db, 'marker', `${e.payload}`));
    setClickedMarker(doc(db, 'marker', `${e.payload}`));
  };

  const deleteMarker = async () => {
    setIsMarkerClicked(false);
    setMarkers((prev) =>
      prev.filter((marker) => marker.id !== clickedMarker.id)
    );
    await deleteDoc(clickedMarker);
  };

  return (
    <div className='map-container'>
      <Map
        defaultCenter={[50.879, 4.6997]}
        center={geo}
        defaultZoom={11}
        onClick={handleE}
      >
        <ZoomControl />
        {markers.map((marker) => (
          <Marker
            width={50}
            anchor={[marker.lat, marker.lng]}
            key={marker.id}
            payload={marker.id}
            onClick={handleClick}
          />
        ))}
        {isMarkerClicked && (
          <Overlay anchor={anchor} offset={[200, 200]}>
            <Popup
              markerInfo={clickedMarker}
              setIsMarkerClicked={setIsMarkerClicked}
              setIsEditorOpen={setIsEditorOpen}
              userId={userId}
              isLogged={isLogged}
              setCurDoc={setCurDoc}
              db={db}
              deleteMarker={deleteMarker}
              setIsCommentsOpen={setIsCommentsOpen}
            />
          </Overlay>
        )}
      </Map>
      {isEditorOpen && (
        <Editor
          setIsEditorOpen={setIsEditorOpen}
          storage={storage}
          curDoc={curDoc}
          setMarkers={setMarkers}
          setIsMarkerClicked={setIsMarkerClicked}
          isMarkerClicked={isMarkerClicked}
          setIsCommentsOpen={setIsCommentsOpen}
        />
      )}
    </div>
  );
}

export default MyMap;
