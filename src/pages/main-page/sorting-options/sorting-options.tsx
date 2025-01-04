import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SortingOption } from '../../../enums';
import { changeOffersSortingOption } from '../../../store/action';
import { RootState } from '../../..';

function buildClassName(option: SortingOption, activeOption: SortingOption) {
  const activeOptionString = option === activeOption ? ' places__option--active' : '';
  return `places__option${activeOptionString}`;
}

function buildOption(option: SortingOption, activeOption: SortingOption, handleOptionClick: (option: SortingOption) => void, index: number) {
  return (
    <li className={buildClassName(option, activeOption)}
      key={index}
      onClick={(e) => {
        e.preventDefault();
        handleOptionClick(option);
      }}
    >
      {option}
    </li>
  );
}

function SortingOptions() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const activeOption = useSelector((state: RootState) => state.offers.offersSortingOption);

  const toggleOptions = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleOptionClick = (option: SortingOption) => {
    setIsOpen(false);
    dispatch(changeOffersSortingOption(option));
  };

  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">Sort by</span>
      <span
        className="places__sorting-type"
        tabIndex={0}
        onClick={toggleOptions}
      >
        {activeOption}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>
      <ul
        className={`places__options places__options--custom ${isOpen ? 'places__options--opened' : ''}`}
      >
        {Object.values(SortingOption).map((option, index) =>
          buildOption(option, activeOption, handleOptionClick, index)
        )}
      </ul>
    </form>
  );
}

export default SortingOptions;
