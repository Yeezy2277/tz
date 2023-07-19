import React, { CSSProperties, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Dropdown as DropdownLib, Input, Row, Menu, InputRef } from "antd";
import { ExchangeArrowDownSvg, ExchangeCrossSvg } from "./ExchangeIcons";
import styles from "../../styles/Exchange/ExchangeDropdown.module.scss"
import { CurrentExchange, ExchangeDropdownProps } from "../../models/exchangeModels";
import { FixedSizeList } from 'react-window';

const Dropdown: React.FC<ExchangeDropdownProps> = ({value,updateCurrentExchange,  onChangeValue, objKey,  exchanges, currentExchange}) => {
  const divRef = useRef<HTMLDivElement>(null);

  const [availableExchanges, setAvailableExchanges] = useState<typeof exchanges>([]);
  const [inputValue, setInputValue] = useState<string>('')

  const [isHovered, setIsHovered] = useState<boolean>(false);

  const inlineStyles = {
    input: {borderRadius: 0, borderTopLeftRadius: 5, borderTopRightRadius: 5},
    menuItem: {width: '88%', background: isHovered ? '#EAF1F7': 'none', padding: '13px 16px', height: 48, display: 'flex', alignItems: 'center'},
    h1: {fontSize: 16, marginLeft: 12, textTransform: 'uppercase' as 'uppercase', fontWeight: '400', color: '#282828'},
    subtitle: {fontSize: 16, marginLeft: 16, fontWeight: '400', color: '#80A2B6',  whiteSpace: 'nowrap' as 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' as 'ellipsis'}
  }

  const chooseExchange = (item: CurrentExchange) => {
    updateCurrentExchange(objKey, item);
    setOpenedDropdown(false);
  }


  const renderMenuItem = ({ index, style }: {index: number, style: CSSProperties}) => {
    const item = availableExchanges[index];
    return (
      <div key={index} onClick={() => chooseExchange(item)} style={{...style, ...inlineStyles.menuItem }}>
        <img src={item.image} alt={item.name} />
        <h1 style={inlineStyles.h1}>{item.ticker}</h1>
        <h2 style={inlineStyles.subtitle}>{item.name}</h2>
      </div>
    );
  };

  useEffect(() => setAvailableExchanges(exchanges), [exchanges]);

  useEffect(() => {
    if (inputValue === '') {
      setAvailableExchanges(exchanges);
      return;
    }
      setAvailableExchanges(exchanges.filter(exchange => exchange.name.includes(inputValue)|| exchange.ticker.includes(inputValue) ));
  }, [inputValue])

  const [isOpenedDropdown, setOpenedDropdown] = useState<boolean>(false);
  const changeDropdownState = () => {
    setOpenedDropdown(!isOpenedDropdown);
  }
    return (
        <div ref={divRef} className={isOpenedDropdown ? styles.ExchangeDropdownActive : styles.ExchangeDropdown}>
            <Input style={inlineStyles.input} onClick={e => e.stopPropagation()}
                   readOnly={objKey === 'toValue' && !isOpenedDropdown}
                   placeholder={isOpenedDropdown ? 'Search' : undefined}
                   onChange={e => isOpenedDropdown ? setInputValue(e.currentTarget.value) : onChangeValue(e.currentTarget.value, objKey)}
                   value={isOpenedDropdown ? inputValue : value}/>
          {isOpenedDropdown && <button onClick={() => setInputValue('')}>
            <ExchangeCrossSvg />
          </button>}
            <DropdownLib placement="bottomLeft" visible={isOpenedDropdown}
                         onOpenChange={changeDropdownState} trigger={['click']} className={styles.buttonSwitcher} overlay={<div>
              <FixedSizeList
                className={styles.dropdownMenu}
                height={480}
                itemCount={availableExchanges.length}
                itemSize={48}
                width={'100%'}
              >
                {renderMenuItem}
              </FixedSizeList>
            </div>}>
                <a onClick={(e) => changeDropdownState}>
                  {!isOpenedDropdown && <div className={styles.space}>
                    <img src={currentExchange?.image} alt={currentExchange?.name} />
                    <p>{currentExchange?.ticker.toUpperCase()}</p>
                    <ExchangeArrowDownSvg />
                  </div>}
                </a>
            </DropdownLib>
        </div>
    );
};

export default Dropdown;