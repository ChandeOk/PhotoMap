import React from 'react';
import './Map.css';
import { nanoid } from 'nanoid';
import { Map, Marker, Overlay } from 'pigeon-maps';
import { useState } from 'react';
import Editor from './Editor';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
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
  const [clickedMarkerId, setClickedMarkerId] = useState();
  const [clickedMarker, setClickedMarker] = useState();
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
    const [lat, lng] = e.latLng;
    const id = nanoid();
    console.log(lat, lng, id);
    console.log(userId);
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
    console.log(e);
    setAnchor(e.anchor);
    setIsMarkerClicked(true);
    setClickedMarkerId(e.payload);
    setCurMarkerDoc(doc(db, 'marker', `${e.payload}`));
    setClickedMarker(doc(db, 'marker', `${e.payload}`));
  };

  const deleteMarker = async () => {
    console.log(markers);
    setIsMarkerClicked(false);
    setMarkers((prev) =>
      prev.filter((marker) => marker.id !== clickedMarker.id)
    );
    await deleteDoc(clickedMarker);
  };

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
              isEditorOpen={isEditorOpen}
              setIsEditorOpen={setIsEditorOpen}
              userId={userId}
              isLogged={isLogged}
              curDoc={curDoc}
              setCurDoc={setCurDoc}
              db={db}
              clickedMarker={clickedMarker}
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
        />
      )}
    </div>
  );
}

export default MyMap;
