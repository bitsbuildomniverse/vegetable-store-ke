import React, { useEffect, useState } from 'react';
import { toJS } from 'mobx';
import {observer} from 'mobx-react';
import { isEqual, compact } from 'lodash'
import { CartItem, ActiveItem } from "../../interfaces";
import { catalogueStore, cartStore } from "../../store";

import classes from './CatalogueItemCard.module.css';

const CatalogueItemCard = observer((props: any) => {

  const {
    item
  } = props

  const [selectedVolume, setSelectedVolume] = useState(item.volumes[0])
  const [currentCount, setCurrentCount] = useState(0)

  const cartItems = toJS(cartStore).cartItems;

  useEffect(() => {
    const newCount = compact(
      cartItems?.map((cartItem: CartItem) => {
        if (isEqual(cartItem.item.selectedVolume, selectedVolume) && cartItem.item.item.name === item.name) {
          return cartItem.count;
        }
      })
    )[0]
    newCount ? setCurrentCount(newCount) : setCurrentCount(0);
  }, [cartItems, selectedVolume, item.name])

  const volumes = item.volumes.map((volume: any, index: number) => {
    if (volume.volume) {
      return (
        <li
          key={index}
          onClick={() => {setSelectedVolume(volume)}}
          className={isEqual(selectedVolume, volume) ? classes.volume_active : classes.volume}
        >
          {volume.volume}
        </li>
      )
    }
  })

  return (
    <li
      className={classes.CatalogueItemCard}
    >
      <div
        className={classes.cover}
        style={{ backgroundImage: `url(${item.cover})` }}
      >
        {
          item.isAvailable && (
            <img
              src={require('../../images/icons/open.svg')}
              alt=""
              className={classes.open}
              onClick={() => catalogueStore.selectActiveItem(item)}
            />
          )
        }
      </div>
      <div className={classes.options}>
        <div className={classes.holder}>
          <span className={classes.type}>{item.type}</span>
          {
            item.isAvailable && (
              <div className={classes.count}>
                <button
                  className={classes.counter}
                  onClick={() => cartStore.removeItemFromCart({ item, selectedVolume }, 1)}
                >
                  <img
                    src={require('../../images/icons/minus.svg')}
                    alt=""
                  />
                </button>
                {currentCount || 0}
                <button
                  className={classes.counter}
                  onClick={() => cartStore.addItemToCart({ item, selectedVolume })}
                >
                  <img
                    src={require('../../images/icons/plus.svg')}
                    alt=""
                  />
                </button>
              </div>
            )
          }
        </div>
        <h2 className={classes.title}>{item.name}</h2>
        {
          item.isAvailable ? (
            <>
              <ul className={classes.list}>
                {item.volumes.length && volumes}
              </ul>
              <div className={classes.column}>
                <h2 className={classes.title}>{selectedVolume.price1} ??????</h2>
                <span className={classes.type}>-10% ???? 1 ???? ?????? ?????????????? 3 ????</span>
              </div>
            </>
          ) : (
            <span className={classes.type}>???????????????? ?????? ?? ??????????????</span>
          )
        }
      </div>
    </li>
  );
});

export { CatalogueItemCard };