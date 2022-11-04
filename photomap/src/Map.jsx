import React from 'react';
import './Map.css';
import { nanoid } from 'nanoid';
import { Map, Marker, Overlay } from 'pigeon-maps';
import { useState } from 'react';
import Editor from './Editor';
import { doc, updateDoc } from 'firebase/firestore';
import Popup from './Popup';

function MyMap({
  markers,
  setMarkers,
  addMarker,
  isLogged,
  userId,
  storage,
  db,
}) {
  const [isMarkerClicked, setIsMarkerClicked] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [curDoc, setCurDoc] = useState();
  const [anchor, setAnchor] = useState([]);
  const [clickedMarkerId, setClickedMarkerId] = useState();
  const [clickedMarker, setClickedMarker] = useState();
  const handleE = (e) => {
    if (!isLogged) {
      alert('Please Log in');
      return;
    }
    const [lat, lng] = e.latLng;
    const id = nanoid();
    console.log(lat, lng, id);
    console.log(userId);
    setMarkers((prev) => [...prev, { lat, lng, id, userId }]);
    addMarker(lat, lng, id, userId);
    setIsEditorOpen(true);
    setCurDoc(doc(db, 'marker', `${id}`));
  };

  const handleClick = (e) => {
    console.log(e);
    setAnchor(e.anchor);
    setIsMarkerClicked(true);
    setClickedMarkerId(e.payload);
    setClickedMarker(doc(db, 'marker', `${e.payload}`));
  };

  console.log(anchor);

  return (
    <div className='map-container'>
      <Map defaultCenter={[50.879, 4.6997]} defaultZoom={11} onClick={handleE}>
        {/* <Marker width={50} anchor={[50.879, 4.6997]} /> */}
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
              id={clickedMarkerId}
              markerInfo={clickedMarker}
              setIsMarkerClicked={setIsMarkerClicked}
            />
          </Overlay>
        )}
      </Map>
      {isEditorOpen && (
        <Editor
          setIsEditorOpen={setIsEditorOpen}
          storage={storage}
          curDoc={curDoc}
          isLogged={isLogged}
        />
      )}
    </div>
  );
}

export default MyMap;
