import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Eye,
  Trash2,
  UserCircle,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Student {
  id: string;
  registration_number: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  gender: string;
  date_of_birth: string;
  photo_url: string | null;
  status: string;
  phone: string | null;
  address: string | null;
  current_class?: {
    name: string;
  };
}

interface StudentsListProps {
  onAddStudent: () => void;
}

export function StudentsList({ onAddStudent }: StudentsListProps) {
  const { profile } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    if (profile?.company_id) {
      fetchStudents();
      fetchClasses();
    }
  }, [profile?.company_id]);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, statusFilter, classFilter]);

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const { data: studentsData, error } = await supabase
        .from('students')
        .select('*')
        .eq('company_id', profile?.company_id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const studentIds = studentsData?.map(s => s.id) || [];

      let enrollmentsData: any[] = [];
      if (studentIds.length > 0) {
        const { data: enrollments } = await supabase
          .from('enrollments')
          .select(`
            student_id,
            classes(name)
          `)
          .in('student_id', studentIds)
          .eq('status', 'enrolled')
          .order('created_at', { ascending: false });

        enrollmentsData = enrollments || [];
      }

      const enrollmentMap = new Map();
      enrollmentsData.forEach((enr: any) => {
        if (!enrollmentMap.has(enr.student_id)) {
          enrollmentMap.set(enr.student_id, enr.classes);
        }
      });

      const processedStudents = studentsData?.map((student: any) => ({
        ...student,
        current_class: enrollmentMap.get(student.id) || null
      })) || [];

      setStudents(processedStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
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

  const filterStudents = () => {
    let filtered = [...students];

    if (statusFilter !== 'all') {
      filtered = filtered.filter((s) => s.status === statusFilter);
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.first_name.toLowerCase().includes(search) ||
          s.last_name.toLowerCase().includes(search) ||
          (s.middle_name && s.middle_name.toLowerCase().includes(search)) ||
          s.registration_number.toLowerCase().includes(search)
      );
    }

    if (classFilter !== 'all') {
      filtered = filtered.filter((s) => s.current_class?.name === classFilter);
    }

    setFilteredStudents(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) return;

    try {
      const { error } = await supabase.from('students').delete().eq('id', id);
      if (error) throw error;
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const exportToExcel = () => {
    const csvContent = [
      ['Matricule', 'Nom', 'Postnom', 'Prénom', 'Sexe', 'Date de naissance', 'Classe', 'Statut'].join(','),
      ...filteredStudents.map((s) =>
        [
          s.registration_number,
          s.last_name,
          s.middle_name || '',
          s.first_name,
          s.gender,
          s.date_of_birth,
          s.current_class?.name || '',
          s.status
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `etudiants_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const statusCounts = {
    all: students.length,
    active: students.filter((s) => s.status === 'active').length,
    transferred: students.filter((s) => s.status === 'transferred').length,
    withdrawn: students.filter((s) => s.status === 'withdrawn').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des étudiants...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Liste des Étudiants</h2>
          <p className="text-gray-600 mt-1">{filteredStudents.length} étudiant(s) trouvé(s)</p>
        </div>
        <button
          onClick={onAddStudent}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          <Plus className="w-5 h-5" />
          Nouvel étudiant
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              statusFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tous ({statusCounts.all})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              statusFilter === 'active'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Actifs ({statusCounts.active})
          </button>
          <button
            onClick={() => setStatusFilter('transferred')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              statusFilter === 'transferred'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Transférés ({statusCounts.transferred})
          </button>
          <button
            onClick={() => setStatusFilter('withdrawn')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              statusFilter === 'withdrawn'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Retirés ({statusCounts.withdrawn})
          </button>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, prénom ou matricule..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Toutes les classes</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.name}>
                {cls.name}
              </option>
            ))}
          </select>

          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
          >
            <FileSpreadsheet className="w-5 h-5" />
            Exporter Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Photo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Matricule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Postnom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prénom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sexe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Classe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <UserCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">Aucun étudiant trouvé</p>
                    <p className="text-gray-500 text-sm mt-1">
                      Modifiez vos filtres ou ajoutez un nouvel étudiant
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.photo_url ? (
                        <img
                          src={student.photo_url}
                          alt={student.first_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <UserCircle className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.registration_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.middle_name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.first_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {student.gender === 'Male' ? 'M' : 'F'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.current_class?.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          student.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : student.status === 'transferred'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {student.status === 'active'
                          ? 'Actif'
                          : student.status === 'transferred'
                          ? 'Transféré'
                          : 'Retiré'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded transition">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-600 hover:bg-gray-50 rounded transition">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
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
