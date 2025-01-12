import { SortingOptionName } from '../../../../enums';

type SortingOptionProps = {
    option: SortingOptionName;
    activeOption: SortingOptionName;
    handleOptionClick: (option: SortingOptionName) => void;
};

function buildClassName(option: SortingOptionName, activeOption: SortingOptionName) {
  const activeOptionString = option === activeOption ? ' places__option--active' : '';
  return `places__option${activeOptionString}`;
}

function SortingOption({option, activeOption, handleOptionClick}: SortingOptionProps) {
  return (
    <li className={buildClassName(option, activeOption)}
      key={option}
      onClick={(e) => {
        e.preventDefault();
        handleOptionClick(option);
      }}
    >
      {option}
    </li>
  );
}

export default SortingOption;
