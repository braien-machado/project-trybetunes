import React from 'react';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import getMusics from '../services/musicsAPI';
import Loading from '../components/Loading';
import MusicCard from '../components/MusicCard';
import './Album.css';
import { getFavoriteSongs } from '../services/favoriteSongsAPI';

class Album extends React.Component {
  constructor(props) {
    super(props);
    const { match: { params: { id } } } = this.props;
    this.state = {
      albumCoverUrl: '',
      artistName: '',
      collectionName: '',
      header: false,
      id,
      loading: false,
      musics: [],
      favoriteSongs: [],
    };
  }

  componentDidMount() {
    this.mounted = true;
    const { id } = this.state;
    if (this.mounted) {
      getFavoriteSongs().then((songs) => this.setState({ favoriteSongs: songs }))
        .then(() => getMusics(id)
          .then((result) => this.setState({ musics: result },
            () => {
              this.setState((prevState) => ({
                artistName: prevState.musics[0].artistName,
                collectionName: prevState.musics[0].collectionName,
                albumCoverUrl: prevState.musics[0].artworkUrl100,
              }));
            })));
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  saveFavInState = () => {
    getFavoriteSongs().then((songs) => this.setState({ favoriteSongs: songs }));
  }

  toogleLoading = (bool) => this.setState({ loading: bool });

  headerOn = () => this.setState({ header: true })

  playlist = () => {
    const {
      loading,
      header,
      musics,
      artistName,
      collectionName,
      albumCoverUrl,
      favoriteSongs } = this.state;
    if (loading && header) {
      return <Loading />;
    }
    if (!loading && header) {
      return (
        <main className="playlist">
          <div className="album-info">
            <img src={ albumCoverUrl } alt="" />
            <h1 data-testid="artist-name">{ artistName }</h1>
            <h2 data-testid="album-name">{ collectionName }</h2>
          </div>
          <div className="music-list">
            {musics.filter((data) => data.wrapperType === 'track' || data.kind === 'song')
              .map((music, index) => {
                const { trackId } = music;
                return (
                  <MusicCard
                    key={ index }
                    music={ music }
                    toogleLoading={ this.toogleLoading }
                    checked={ favoriteSongs.some(
                      (song) => JSON.stringify(song) === JSON.stringify(music),
                    ) }
                    saveFavInState={ this.saveFavInState }
                    trackId={ trackId }
                  />
                );
              })}
          </div>
        </main>
      );
    }
  }

  render() {
    return (
      <div data-testid="page-album">
        <Header headerIsReady={ this.headerOn } />
        {this.playlist()}
      </div>
    );
  }
}

export default Album;

Album.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired }).isRequired,
};
