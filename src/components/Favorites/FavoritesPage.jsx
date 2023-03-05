import React from 'react';
import { Link } from 'react-router-dom';

class Favorites extends React.Component {
  render() {
    return this.props.favorites.map((symbol) => {
      const price = this.props.prices[symbol];
      return (
        <tr key={symbol}>
          <td onClick={() => this.props.handleSelectSymbol(symbol)}>
            <Link to={`/details/${symbol}`}>{symbol}</Link>
          </td>
          <td>{price.lastPrice}</td>
          <td>{price.dailyChange}</td>
          <td>{price.dailyChangePercent}%</td>
          <td>{price.dailyHigh}</td>
          <td>{price.dailyLow}</td>
        </tr>
      );
    });
  }
}

export default Favorites;
