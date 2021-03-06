import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { addSong, removeSong } from '../services/favoriteSongsAPI';

export default class MusicCard extends Component {
  toogleFavorite = ({ target: { checked } }) => (checked
    ? this.addFavorite()
    : this.removeFavorite());

  addFavorite = () => {
    const { music, toogleLoading, saveFavInState } = this.props;
    toogleLoading(true);
    addSong(music).then(() => toogleLoading(false)).then(saveFavInState());
  }

  removeFavorite = () => {
    const { music, toogleLoading, saveFavInState } = this.props;
    toogleLoading(true);
    removeSong(music).then(() => toogleLoading(false)).then(saveFavInState());
  }

  render() {
    const { music: { trackName, previewUrl }, checked, trackId } = this.props;
    return (
      <div className="music-card">
        <h4>{ trackName }</h4>
        <audio data-testid="audio-component" src={ previewUrl } controls>
          <track kind="captions" />
          O seu navegador não suporta o elemento
          <code>audio</code>
          .
        </audio>
        <label htmlFor={ `checkbox-music-${trackId}` }>
          <input
            type="checkbox"
            id={ `checkbox-music-${trackId}` }
            data-testid={ `checkbox-music-${trackId}` }
            onChange={ this.toogleFavorite }
            checked={ checked }
          />
          <p>Favorita</p>
        </label>
      </div>
    );
  }
}

MusicCard.propTypes = {
  music: PropTypes.shape({
    previewUrl: PropTypes.string.isRequired,
    trackName: PropTypes.string.isRequired,
  }).isRequired,
  trackId: PropTypes.number.isRequired,
  toogleLoading: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
  saveFavInState: PropTypes.func.isRequired,
};
