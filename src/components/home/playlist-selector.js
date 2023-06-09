import { isDisabled } from "@testing-library/user-event/dist/utils";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBoundedVariablesThunk, getTracksFromPlaylistThunk } from "../../services/songthunks";
import { setLoadingSongs, setSongs } from "../../state/reducers/songreducer"; 
import { setCurrentPlaylist } from "../../state/reducers/songreducer";
import { setLoadingMetrics } from "../../state/reducers/songreducer";
import { Link, useParams } from "react-router-dom";
import { promise } from "./sliders";
import { promiseBoundedVars } from "../playlist/playlist-page";

const PlaylistSelector = () => {

    useEffect(() => {
       if (promise) {
            promise.abort();
       } 
        if (promiseBoundedVars) {
            promiseBoundedVars.abort();
        }
    })

    const dispatcher = useDispatch()
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
        <div className="row m-2"> 
        {playlists.map((plist, index) => 
            <div className="col-sm-6 col-md-4 col-lg-3 ovf-h position-relative increase-size mt-2 mb-2 p-0"> 
                <Link className="link-tag" 
                to={`/playlist/${getPlaylistID(plist.name)}/${plist.name}/access_token=${accessToken}`}>
                <span className="fg-white position-absolute album-title appear-on-hover">{plist.name}</span>
                        <img className={`playlist-img rounded mx-auto d-block m-0`} src={`
                            ${ plist.images[0] === undefined ? 'https://picsum.photos/200/300' : plist.images[0].url}
                        `}>
                        </img>
                </Link>

            </div>
        )}
        </div>
    );
}
export default PlaylistSelector;