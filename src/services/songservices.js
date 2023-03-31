import SpotifyWebApi from "spotify-web-api-js"
import userInfoReducer from '../state/reducers/songreducer'

const spotifyWebApiHandler = new SpotifyWebApi();

export const setAccessTokenAPI = (access_token) => {
    spotifyWebApiHandler.setAccessToken(access_token);
}

export const getUserPlaylists = async () => {
    const playlists = await spotifyWebApiHandler.getUserPlaylists();
    console.log(playlists);
    return playlists;

}

const calculateCuratedValue = (audioFeatures, sliders) => {
    let res = 0;
    for (const [key, value] of Object.entries(sliders)) {
        res += Math.abs(value - audioFeatures[key])
    }
    return res;
}
// can get the playlist, find out how many tracks it has from .items.tracks.total then do a loop
export const getTracksFromPlaylist = async (id, sliders) => {
    console.log(sliders);
    let res = [];
    const playlist = await spotifyWebApiHandler.getPlaylist(id);
    const num_tracks = playlist.tracks.total;
    let counter = 0;
    while (counter < num_tracks) {
        const tracks = await spotifyWebApiHandler.getPlaylistTracks(id);
        for (let j = 0; j < tracks.items.length; j++) {
            let audioFeatures = await spotifyWebApiHandler.getAudioFeaturesForTrack(tracks.items[j].track.id);
            let curated_value = calculateCuratedValue(audioFeatures, sliders);
            res.push({...tracks.items[j].track, curated_value: curated_value});
        }
        counter+=100;
    }
    return res;
}
