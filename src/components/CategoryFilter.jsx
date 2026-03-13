import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { setFilteredCategory } from '../store/threadsSlice';

const CategoryFilter = ({ categories }) => {
  const dispatch = useDispatch();
  const { filteredCategory } = useSelector((state) => state.threads);

  const handleSelect = (category) => {
    dispatch(
      setFilteredCategory(filteredCategory === category ? null : category),
    );
  };

  return (
    <aside className='category-filter'>
      <h3 className='category-filter__title'>Kategori</h3>
      <ul className='category-filter__list'>
        <li>
          <button
            type='button'
            className={`category-filter__btn ${filteredCategory === null ? 'category-filter__btn--active' : ''}`}
            onClick={() => dispatch(setFilteredCategory(null))}
          >
            Semua
          </button>
        </li>
        {categories.map((cat) => (
          <li key={cat}>
            <button
              type='button'
              className={`category-filter__btn ${filteredCategory === cat ? 'category-filter__btn--active' : ''}`}
              onClick={() => handleSelect(cat)}
            >
              #{cat}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

CategoryFilter.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default CategoryFilter;
