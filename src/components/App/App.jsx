import React, { Component } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Details from '../Details/DetailsPage';
import Favorites from '../Favorites/FavoritesPage';
import HomePage from '../Home/HomePage';

class CryptoPrices extends Component {
  state = {
    currencyPairs: [],
    prices: {},
    favorites: [],
    isLoggedIn: false,
    selectedSymbol: null,
    showFavoritesOnly: null,
  };

  componentDidMount() {
    this.fetchAllPrices();

    // Check is user logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.setState({ isLoggedIn });

    // Load favorite currency pairs from local storage
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    this.setState({ favorites });

    // Set up polling to fetch new prices every 10 seconds
    this.pollInterval = setInterval(this.fetchAllPrices, 10000);
  }

  componentWillUnmount() {
    // Clear the polling interval to avoid memory leaks
    clearInterval(this.pollInterval);
  }

  fetchAllPrices = () => {
    // Fetch current prices for all currency pairs
    fetch('/v2/tickers?symbols=ALL')
      .then((response) => {
        return response.json();
      })
      .then((allPairs) => {
        return allPairs.slice(0, 5);
      })
      .then((data) => {
        const pricesObj = {};
        data.forEach((price) => {
          const symbol = price[0];
          const lastPrice = price[6];
          const dailyChange = price[5];
          const dailyChangePercent = ((dailyChange / price[1]) * 100).toFixed(2);
          const dailyHigh = price[8];
          const dailyLow = price[9];

          pricesObj[symbol] = {
            lastPrice,
            dailyChange,
            dailyChangePercent,
            dailyHigh,
            dailyLow,
          };
        });
        this.setState({ prices: pricesObj });
      })
      .catch((error) => console.error(error));
  };

  handleToggleFavorite = (symbol) => {
    // Toggle favorite status for logged in user
    if (this.state.isLoggedIn) {
      this.setState((prevState) => {
        const favorites = [...prevState.favorites];
        const index = favorites.indexOf(symbol);
        if (index !== -1) {
          favorites.splice(index, 1);
        } else {
          favorites.push(symbol);
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
        return { favorites };
      });
    }
  };

  handleLogin = () => {
    // Update the isLoggedIn state variable to true
    this.setState({ isLoggedIn: true });

    // Store isLoggedIn in local storage
    localStorage.setItem('isLoggedIn', true);
  };

  handleSelectSymbol = (symbol) => {
    // Set the selected item to the clicked symbol
    this.setState({ selectedSymbol: symbol });
  };

  render() {
    const { isLoggedIn, favorites, prices, selectedSymbol, showFavoritesOnly } = this.state;

    return Object.keys(prices).length > 0 ? (
      <div className="CryptoPrices">
        <header>
          <div className="buttons">
            <Link to="/">
              <button onClick={() => this.handleSelectSymbol(null)} className="nav-btn">
                Home Page
              </button>
            </Link>
            {isLoggedIn && favorites && (
              <Link to="/favorites">
                <button
                  onClick={() => this.setState({ showFavoritesOnly: !showFavoritesOnly })}
                  className="nav-btn"
                >
                  Favorites
                </button>
              </Link>
            )}
          </div>
          {isLoggedIn ? (
            <p>Welcome, user!</p>
          ) : (
            <button onClick={this.handleLogin} className="standard-btn">
              Login
            </button>
          )}
        </header>
        <main>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Last</th>
                <th>Change</th>
                <th>Change Percent</th>
                <th>High</th>
                <th>Low</th>
              </tr>
            </thead>
            <tbody>
              <Routes>
                <Route
                  exact
                  path="/"
                  element={
                    <HomePage prices={prices} handleSelectSymbol={this.handleSelectSymbol} />
                  }
                />
                <Route
                  path="/favorites"
                  element={
                    <Favorites
                      favorites={favorites}
                      prices={prices}
                      handleSelectSymbol={this.handleSelectSymbol}
                    />
                  }
                />
                <Route
                  path="/details/:selectedSymbol"
                  element={
                    <Details
                      prices={prices}
                      selectedSymbol={selectedSymbol}
                      handleSelectSymbol={this.handleSelectSymbol}
                    />
                  }
                />
              </Routes>
            </tbody>
          </table>
          {isLoggedIn && window.location.pathname === `/details/${selectedSymbol}` && (
            <button
              onClick={() => this.handleToggleFavorite(selectedSymbol)}
              className={favorites.includes(selectedSymbol) ? 'remove-favorite' : 'add-favorite'}
            >
              {favorites.includes(selectedSymbol) ? 'Remove from favorites' : 'Add to favorites'}
            </button>
          )}
        </main>
      </div>
    ) : (
      <div>Loading...</div>
    );
  }
}

export default CryptoPrices;
