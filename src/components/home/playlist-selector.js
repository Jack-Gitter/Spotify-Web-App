import { isDisabled } from "@testing-library/user-event/dist/utils";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBoundedVariablesThunk, getTracksFromPlaylistThunk } from "../../services/songthunks";
import { setLoadingSongs, setSongs } from "../../state/reducers/songreducer"; 
import { setCurrentPlaylist } from "../../state/reducers/songreducer";
import { setLoadingMetrics } from "../../state/reducers/songreducer";
import { Link, useParams } from "react-router-dom";

const PlaylistSelector = () => {


    // eslint-disable-next-line
    const {loadingMetrics, currentPlaylist,loadingSongs, accessToken, refreshToken, playlists, songs, sliders} = useSelector((store) => store.userInfoReducer);
    const getPlaylistID = (n) => {
        for (let i = 0; i < playlists.length; i++) {
            if (playlists[i].name === n) {
                return playlists[i].id;
            }
        } 
        return -1;
    }

    return (
    <div className="playlist-selector">
        <div className="row">
        {playlists.map((plist, index) => 
            <div className="col-3">
            <Link to={`/playlist/${getPlaylistID(plist.name)}/access_token=${accessToken}`}>
                <img className={`playlist-img`} src={`
                    ${ plist.images[0] === undefined ? 'https://picsum.photos/200/300' : plist.images[0].url}
                `}></img></Link>
            </div>
        )}
        </div>
    </div>
    );
}
export default PlaylistSelector;
