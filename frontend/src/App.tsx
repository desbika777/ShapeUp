import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '@/components/protected-route';
import { ShellRoute } from '@/components/layout/shell-route';
import { ForgotPasswordPage } from '@/pages/auth/forgot-password-page';
import { LoginPage } from '@/pages/auth/login-page';
import { RegisterPage } from '@/pages/auth/register-page';
import { ResetPasswordPage } from '@/pages/auth/reset-password-page';
import { DashboardPage } from '@/pages/dashboard/dashboard-page';
import { ProfilePage } from '@/pages/profile-page';
import { PlanFormPage } from '@/pages/plans/plan-form-page';
import { PlansPage } from '@/pages/plans/plans-page';
import { StudentFormPage } from '@/pages/students/student-form-page';
import { StudentsPage } from '@/pages/students/students-page';
import { WorkoutFormPage } from '@/pages/workouts/workout-form-page';
import { WorkoutsPage } from '@/pages/workouts/workouts-page';

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<ShellRoute />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/plans/new" element={<PlanFormPage />} />
          <Route path="/plans/:id/edit" element={<PlanFormPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/students/new" element={<StudentFormPage />} />
          <Route path="/students/:id/edit" element={<StudentFormPage />} />
          <Route path="/workouts" element={<WorkoutsPage />} />
          <Route path="/workouts/new" element={<WorkoutFormPage />} />
          <Route path="/workouts/:id/edit" element={<WorkoutFormPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
