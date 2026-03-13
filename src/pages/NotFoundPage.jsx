import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <main className='page page--center'>
    <div className='not-found'>
      <h1 className='not-found__code'>404</h1>
      <h2 className='not-found__title'>Halaman Tidak Ditemukan</h2>
      <p className='not-found__desc'>
        Halaman yang Anda cari tidak ada atau sudah dipindahkan.
      </p>
      <Link to='/' className='btn btn--primary'>
        Kembali ke Beranda
      </Link>
    </div>
  </main>
);

export default NotFoundPage;
