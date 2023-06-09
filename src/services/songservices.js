import SpotifyWebApi from "spotify-web-api-js"
import userInfoReducer from '../state/reducers/songreducer'
import { getBoundedVariablesThunk } from "./songthunks";

const spotifyWebApiHandler = new SpotifyWebApi();

export const setAccessTokenAPI = (access_token) => {
    spotifyWebApiHandler.setAccessToken(access_token);
}

export const searchSpotify = async (searchQuery) => {
    const playlists = await spotifyWebApiHandler.searchPlaylists(searchQuery, {limit: 50});
    return playlists
}

export const getUserPlaylists = async () => {
    const playlists = await spotifyWebApiHandler.getUserPlaylists({limit: 50});
    return playlists;
}

const calculateCuratedValue = (audioFeatures, sliders) => {
    let res = 0;
    for (const [key, value] of Object.entries(sliders)) {
        res += Math.abs(value - audioFeatures[key])
        console.log('requested duration is: ' + value)
        console.log('track duration is: ' + audioFeatures[key])
    }
    console.log('result is: ' + res);
    return res;
}
// can get the playlist, find out how many tracks it has from .items.tracks.total then do a loop

export const getBoundedVariables = async (id) => {
    let max_duration = 0;
    let min_duration = Number.MAX_VALUE; 
    let max_tempo = 0; 
    let min_tempo = Number.MAX_VALUE;

    const playlist = await spotifyWebApiHandler.getPlaylist(id);
    const num_tracks = playlist.tracks.total;
    let counter = 0;
    while (counter < num_tracks) {
        const tracks = await spotifyWebApiHandler.getPlaylistTracks(id, {offset: counter});
        const trackIds = [];
        for (let j = 0; j < tracks.items.length; j++) {
            if (Object.is(tracks.items[j].track, null) ||
                tracks.items[j].track.album === undefined) {
                continue;
            }
            trackIds.push(tracks.items[j].track.id);
        }

        let audioFeatures = await spotifyWebApiHandler.getAudioFeaturesForTracks(trackIds)

        for (let j = 0; j < audioFeatures.audio_features.length; j++) {
            if (Object.is(audioFeatures.audio_features[j], null)) {
                continue;
            }
            max_duration = audioFeatures.audio_features[j]['duration_ms'] > max_duration ? audioFeatures.audio_features[j]['duration_ms'] : max_duration;
            min_duration = audioFeatures.audio_features[j]['duration_ms'] < min_duration ? audioFeatures.audio_features[j]['duration_ms'] : min_duration;
            max_tempo = audioFeatures.audio_features[j]['tempo'] > max_tempo ? audioFeatures.audio_features[j]['tempo'] : max_tempo;
            min_tempo = audioFeatures.audio_features[j]['tempo'] < min_tempo ? audioFeatures.audio_features[j]['tempo'] : min_tempo;
        }
        
        counter+=100;
    }
    return [max_duration, min_duration, max_tempo, min_tempo]
}

export const getTracksFromPlaylist = async (id, sliders) => {
    let res = [];
    const playlist = await spotifyWebApiHandler.getPlaylist(id);
    const num_tracks = playlist.tracks.total;
    let counter = 0;
    while (counter < num_tracks) {
        const tracks = await spotifyWebApiHandler.getPlaylistTracks(id, {offset: counter});

        const trackItems = tracks.items.filter((item) => item.track !== null)
        tracks.items = trackItems;

        const trackIds = [];
        for (let j = 0; j < tracks.items.length; j++) {
            if (Object.is(tracks.items[j].track, null)) {
                continue;
            }
            trackIds.push(tracks.items[j].track.id);
        }
        const audioFeatures = await spotifyWebApiHandler.getAudioFeaturesForTracks(trackIds);
        for (let j = 0; j < audioFeatures.audio_features.length; j++) {
            if (Object.is(audioFeatures.audio_features[j], null)) {
                continue;
            }
            console.log('calculating curated value for: ' + trackIds[j])
            let curated_value = calculateCuratedValue(audioFeatures.audio_features[j], sliders);
            res.push({...tracks.items[j].track, curated_value: curated_value});
        }
        counter+=100;
    }
    return res
}

export const getPlaylistIMG = async (plistID) => {
    let playlistIMG = await spotifyWebApiHandler.getPlaylist(plistID)
    if (playlistIMG.images[0] === undefined) {
        playlistIMG = ''
    } else {
        playlistIMG = playlistIMG.images[0].url;
    }
    return playlistIMG
}
