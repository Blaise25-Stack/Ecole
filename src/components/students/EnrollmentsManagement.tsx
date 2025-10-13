import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Enrollment {
  id: string;
  enrollment_date: string;
  status: string;
  roll_number: string | null;
  student: {
    id: string;
    registration_number: string;
    first_name: string;
    last_name: string;
    middle_name: string | null;
  };
  class: {
    name: string;
  };
  academic_year: {
    name: string;
  };
}

export function EnrollmentsManagement() {
  const { profile } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [academicYear, setAcademicYear] = useState<any>(null);

  const [formData, setFormData] = useState({
    student_id: '',
    class_id: '',
    enrollment_date: new Date().toISOString().split('T')[0],
    roll_number: '',
  });

  useEffect(() => {
    if (profile?.company_id) {
      fetchEnrollments();
      fetchStudents();
      fetchClasses();
      fetchAcademicYear();
    }
  }, [profile?.company_id]);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          student:students(id, registration_number, first_name, last_name, middle_name),
          class:classes(name),
          academic_year:academic_years(name)
        `)
        .eq('status', 'enrolled')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEnrollments(data || []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('id, registration_number, first_name, last_name, middle_name')
        .eq('company_id', profile?.company_id)
        .eq('status', 'active')
        .order('last_name');

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('id, name')
        .eq('company_id', profile?.company_id)
        .order('name');

      if (error) throw error;
      setClasses(data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchAcademicYear = async () => {
    try {
      const { data, error } = await supabase
        .from('academic_years')
        .select('id, name')
        .eq('company_id', profile?.company_id)
        .eq('is_current', true)
        .single();

      if (error) throw error;
      setAcademicYear(data);
    } catch (error) {
      console.error('Error fetching academic year:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.student_id || !formData.class_id) {
      alert('Veuillez remplir tous les champs requis');
      return;
    }

    if (!academicYear) {
      alert('Aucune année scolaire active trouvée');
      return;
    }

    try {
      const { error } = await supabase.from('enrollments').insert({
        student_id: formData.student_id,
        class_id: formData.class_id,
        academic_year_id: academicYear.id,
        enrollment_date: formData.enrollment_date,
        roll_number: formData.roll_number || null,
        status: 'enrolled',
      });

      if (error) throw error;

      alert('Inscription créée avec succès');
      setShowForm(false);
      setFormData({
        student_id: '',
        class_id: '',
        enrollment_date: new Date().toISOString().split('T')[0],
        roll_number: '',
      });
      fetchEnrollments();
    } catch (error: any) {
      console.error('Error creating enrollment:', error);
      alert(`Erreur: ${error.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette inscription ?')) return;

    try {
      const { error } = await supabase.from('enrollments').delete().eq('id', id);
      if (error) throw error;
      fetchEnrollments();
    } catch (error) {
      console.error('Error deleting enrollment:', error);
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Inscriptions</h2>
          <p className="text-gray-600 mt-1">{enrollments.length} inscription(s) active(s)</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          <Plus className="w-5 h-5" />
          Nouvelle inscription
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Nouvelle Inscription</h3>
            <button
              onClick={() => setShowForm(false)}
              className="p-1 hover:bg-gray-100 rounded transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Étudiant <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.student_id}
                  onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner un étudiant</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.registration_number} - {student.last_name} {student.first_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Classe <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.class_id}
                  onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner une classe</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date d'inscription
                </label>
                <input
                  type="date"
                  value={formData.enrollment_date}
                  onChange={(e) => setFormData({ ...formData, enrollment_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de liste
                </label>
                <input
                  type="text"
                  value={formData.roll_number}
                  onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
                  placeholder="Ex: 001"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                Créer l'inscription
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Matricule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Étudiant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Classe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Année scolaire
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  N° Liste
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {enrollments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-600">
                    Aucune inscription trouvée
                  </td>
                </tr>
              ) : (
                enrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {enrollment.student.registration_number}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {enrollment.student.last_name} {enrollment.student.middle_name}{' '}
                      {enrollment.student.first_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{enrollment.class.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {enrollment.academic_year.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {enrollment.roll_number || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(enrollment.enrollment_date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button className="p-1 text-gray-600 hover:bg-gray-100 rounded transition">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(enrollment.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
