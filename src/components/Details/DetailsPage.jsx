import React from 'react';
import { useParams } from 'react-router-dom';

const Details = (props) => {
  const { selectedSymbol } = useParams();
  return (
    <tr>
      <td>{selectedSymbol}</td>
      <td>{props.prices[selectedSymbol].lastPrice}</td>
      <td>{props.prices[selectedSymbol].dailyChange}</td>
      <td>{props.prices[selectedSymbol].dailyChangePercent}%</td>
      <td>{props.prices[selectedSymbol].dailyHigh}</td>
      <td>{props.prices[selectedSymbol].dailyLow}</td>
    </tr>
  );
};

export default Details;
