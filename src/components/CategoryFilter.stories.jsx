import CategoryFilter from './CategoryFilter';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import threadsReducer from '../store/threadsSlice';

// A mock store to provide the Redux context for CategoryFilter
const Mockstore = ({ children, initialState }) => {
  const store = configureStore({
    reducer: {
      threads: threadsReducer,
    },
    preloadedState: {
      threads: {
        filteredCategory: initialState.filteredCategory,
        threads: [],
        loading: false,
        error: null,
      },
    },
  });

  return <Provider store={store}>{children}</Provider>;
};

export default {
  title: 'Components/CategoryFilter',
  component: CategoryFilter,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Mockstore initialState={{ filteredCategory: null }}>
        <Story />
      </Mockstore>
    ),
  ],
};

export const DefaultAllSelected = {
  args: {
    categories: ['react', 'redux', 'javascript', 'testing'],
  },
};

export const WithActiveCategory = {
  decorators: [
    (Story) => (
      <Mockstore initialState={{ filteredCategory: 'react' }}>
        <Story />
      </Mockstore>
    ),
  ],
  args: {
    categories: ['react', 'redux', 'javascript', 'testing'],
  },
};
