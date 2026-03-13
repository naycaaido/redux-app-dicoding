import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchThreads } from '../store/threadsSlice';
import { fetchUsers } from '../store/usersSlice';
import ThreadCard from '../components/ThreadCard';
import CategoryFilter from '../components/CategoryFilter';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage = () => {
  const dispatch = useDispatch();
  const { threads, filteredCategory, loading } = useSelector(
    (state) => state.threads,
  );
  const { users } = useSelector((state) => state.users);
  const { authedUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchThreads());
    dispatch(fetchUsers());
  }, [dispatch]);

  const categories = useMemo(
    () => [...new Set(threads.map((t) => t.category))],
    [threads],
  );

  const displayedThreads = useMemo(
    () =>
      filteredCategory
        ? threads.filter((t) => t.category === filteredCategory)
        : threads,
    [threads, filteredCategory],
  );

  const getOwner = (ownerId) => users.find((u) => u.id === ownerId);

  return (
    <main className='page'>
      <div className='container'>
        <div className='home-header'>
          <h1 className='home-header__title'>Forum Diskusi</h1>
          {authedUser && (
            <Link to='/new-thread' className='btn btn--primary'>
              + Buat Thread
            </Link>
          )}
        </div>

        <div className='home-layout'>
          <CategoryFilter categories={categories} />

          <section className='thread-list'>
            {loading && <LoadingSpinner />}
            {!loading && displayedThreads.length === 0 && (
              <div className='empty-state'>
                <p>Tidak ada thread yang ditemukan.</p>
              </div>
            )}
            {!loading &&
              displayedThreads.map((thread) => (
                <ThreadCard
                  key={thread.id}
                  thread={thread}
                  owner={getOwner(thread.ownerId)}
                />
              ))}
          </section>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
