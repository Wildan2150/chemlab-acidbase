import { useAuth } from '../contexts/AuthContext.jsx';
import { TEACHER_EMAIL } from '../lib/teacherAccess.js';
import { Icon } from '../components/Visuals.jsx';
import TeacherDashboard from './TeacherDashboard.jsx';

export default function Teacher() {
  const { user, isTeacher } = useAuth();
  if (isTeacher) return <TeacherDashboard key={user.uid} />;
  const needsVerification = user?.email?.toLowerCase() === TEACHER_EMAIL;
  return (
    <section className="empty-state surface teacher-access-state">
      <Icon name="teacher" size={40} />
      <h1>
        {!user
          ? 'Masuk sebagai guru'
          : needsVerification
            ? 'Verifikasi akun guru'
            : 'Akses khusus guru'}
      </h1>
      <p>
        {!user
          ? 'Masuk dengan akun guru untuk melihat progres dan hasil belajar siswa.'
          : needsVerification
            ? 'Konfirmasi alamat emailmu sebelum membuka data siswa. Gunakan halaman akun untuk memeriksa status verifikasi.'
            : 'Akun ini belum memiliki akses ke panel guru. Kamu tetap dapat melanjutkan belajar dan melihat progres sendiri.'}
      </p>
      <a
        className="button primary"
        href={!user ? '#masuk' : needsVerification ? '#akun' : '#beranda'}
      >
        {!user
          ? 'Masuk ke akun'
          : needsVerification
            ? 'Kelola verifikasi akun'
            : 'Kembali ke beranda'}
        <Icon name="arrow" size={16} />
      </a>
    </section>
  );
}
