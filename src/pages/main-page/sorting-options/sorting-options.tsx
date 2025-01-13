import { useState } from 'react';
import { SortingOptionName } from '../../../enums';
import { changeOffersSortingOption } from '../../../store/action';
import SortingOption from './sorting-option/sorting-option';
import { useAppDispatch } from '../../../hooks/use-app-dispatch';
import { useAppSelector } from '../../../hooks/use-app-selector';
import { selectActiveSortingOption } from '../../../store/selectors';


function SortingOptions() {
  const dispatch = useAppDispatch();
  const activeOption = useAppSelector(selectActiveSortingOption);
  const [isOpen, setIsOpen] = useState(false);

  const toggleOptions = () => {
    setIsOpen((previousState) => !previousState);
  };

  const handleOptionClick = (option: SortingOptionName) => {
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
        data-testid="toggleOptions"
      >
        {activeOption}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>
      <ul data-testid='options' className={`places__options places__options--custom ${isOpen ? 'places__options--opened' : ''}`}>
        {Object.values(SortingOptionName).map((option) =>
          <SortingOption key={option} option={option} activeOption={activeOption} handleOptionClick={handleOptionClick}/>
        )}
      </ul>
    </form>
  );
}

export default SortingOptions;
